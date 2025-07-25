"""
LLM Service Factory and Manager

This module provides a factory for creating LLM providers and CELPIP task generators.
"""

import logging
from typing import Dict, Type, Optional
from enum import Enum

from app.services.llm_provider import LLMProvider, CELPIPTaskGenerator
from app.services.providers.gemini_provider import GeminiProvider
from app.services.celpip_generator import CELPIPGenerator

logger = logging.getLogger(__name__)


class LLMProviderType(str, Enum):
    """Supported LLM provider types."""
    GEMINI = "gemini"
    # Future providers can be added here
    # ANTHROPIC = "anthropic"
    # OPENAI = "openai"


class LLMServiceFactory:
    """Factory for creating LLM providers and task generators."""
    
    # Registry of available providers
    _providers: Dict[LLMProviderType, Type[LLMProvider]] = {
        LLMProviderType.GEMINI: GeminiProvider,
    }
    
    @classmethod
    def create_provider(cls, provider_type: LLMProviderType = LLMProviderType.GEMINI) -> LLMProvider:
        """
        Create an LLM provider instance.
        
        Args:
            provider_type: Type of provider to create
            
        Returns:
            LLM provider instance
            
        Raises:
            ValueError: If provider type is not supported
        """
        if provider_type not in cls._providers:
            available_providers = list(cls._providers.keys())
            raise ValueError(f"Unsupported provider type: {provider_type}. Available: {available_providers}")
        
        provider_class = cls._providers[provider_type]
        logger.info(f"Creating {provider_type} provider")
        
        return provider_class()
    
    @classmethod
    def create_celpip_generator(cls, provider_type: LLMProviderType = LLMProviderType.GEMINI) -> CELPIPTaskGenerator:
        """
        Create a CELPIP task generator with specified provider.
        
        Args:
            provider_type: Type of LLM provider to use
            
        Returns:
            CELPIP task generator instance
        """
        provider = cls.create_provider(provider_type)
        logger.info(f"Creating CELPIP generator with {provider_type} provider")
        
        return CELPIPGenerator(provider)
    
    @classmethod
    def register_provider(cls, provider_type: LLMProviderType, provider_class: Type[LLMProvider]):
        """
        Register a new LLM provider.
        
        Args:
            provider_type: Type identifier for the provider
            provider_class: Provider class to register
        """
        cls._providers[provider_type] = provider_class
        logger.info(f"Registered new provider: {provider_type}")
    
    @classmethod
    def get_available_providers(cls) -> list[LLMProviderType]:
        """Get list of available provider types."""
        return list(cls._providers.keys())


class LLMService:
    """
    Main service class for LLM operations.
    
    This class provides a singleton-like interface for accessing CELPIP task generation
    capabilities with different LLM providers.
    """
    
    def __init__(self, default_provider: LLMProviderType = LLMProviderType.GEMINI):
        """
        Initialize LLM service.
        
        Args:
            default_provider: Default LLM provider to use
        """
        self.default_provider = default_provider
        self._generator_cache: Dict[LLMProviderType, CELPIPTaskGenerator] = {}
    
    def get_generator(self, provider_type: Optional[LLMProviderType] = None) -> CELPIPTaskGenerator:
        """
        Get a CELPIP task generator.
        
        Args:
            provider_type: LLM provider type to use. If None, uses default.
            
        Returns:
            CELPIP task generator instance
        """
        provider = provider_type or self.default_provider
        
        # Use cached generator if available
        if provider not in self._generator_cache:
            self._generator_cache[provider] = LLMServiceFactory.create_celpip_generator(provider)
        
        return self._generator_cache[provider]
    
    async def health_check(self, provider_type: Optional[LLMProviderType] = None) -> bool:
        """
        Check health of specified or default provider.
        
        Args:
            provider_type: Provider to check. If None, uses default.
            
        Returns:
            True if provider is healthy, False otherwise
        """
        try:
            generator = self.get_generator(provider_type)
            return await generator.health_check()
        except Exception as e:
            logger.error(f"Health check failed for {provider_type or self.default_provider}: {str(e)}")
            return False
    
    def get_provider_info(self, provider_type: Optional[LLMProviderType] = None) -> str:
        """
        Get information about the specified or default provider.
        
        Args:
            provider_type: Provider to get info for. If None, uses default.
            
        Returns:
            Provider name string
        """
        generator = self.get_generator(provider_type)
        return generator.llm_provider.get_provider_name()


# Global service instance
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """
    Get the global LLM service instance.
    
    Returns:
        LLM service singleton instance
    """
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service


def set_default_provider(provider_type: LLMProviderType):
    """
    Set the default LLM provider for the global service.
    
    Args:
        provider_type: Provider type to set as default
    """
    global _llm_service
    _llm_service = LLMService(provider_type)