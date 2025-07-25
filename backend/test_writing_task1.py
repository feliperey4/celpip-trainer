import asyncio
import json
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from unittest.mock import AsyncMock, Mock
from app.services.celpip_generator import CELPIPGenerator
from app.services.llm_provider import LLMProvider
from app.models.writing import WritingTask1


class MockLLMProvider(LLMProvider):
    """Mock LLM provider for testing"""
    
    def __init__(self):
        # Mock successful Writing Task 1 response
        self.mock_response = {
            "scenario": {
                "scenario_id": "test_scenario_001",
                "title": "Apartment Heating Issue",
                "context": "You are a tenant in a downtown Toronto apartment building. For the past three days, your heating system has not been working properly. Despite adjusting the thermostat multiple times, your apartment remains cold, especially during the early morning and evening hours. The outside temperature has been below freezing, making the situation uncomfortable and potentially unhealthy. You have spoken with your neighbor who mentioned they are experiencing similar issues. You need to contact your property manager to report this problem and request immediate action.",
                "recipient": "Property Manager",
                "purpose": "complaint",
                "key_points": [
                    "Describe the heating problem and how long it has been occurring",
                    "Explain the impact on your daily life and comfort",
                    "Mention that other tenants are also affected",
                    "Request immediate repair action and timeline for resolution"
                ],
                "tone": "formal",
                "relationship": "professional"
            }
        }
    
    async def generate_content(self, prompt: str) -> str:
        """Mock content generation - return JSON response"""
        return f"```json\n{json.dumps(self.mock_response, indent=2)}\n```"
    
    async def health_check(self) -> bool:
        """Mock health check"""
        return True
    
    def get_provider_name(self) -> str:
        """Mock provider name"""
        return "MockProvider"


async def test_writing_task1_generation():
    """Test Writing Task 1 generation with mocked LLM provider"""
    print("🧪 Testing CELPIP Writing Task 1 Generation...")
    
    try:
        # Create mock provider and generator
        mock_provider = MockLLMProvider()
        generator = CELPIPGenerator(mock_provider)
        
        print("✅ Created mock provider and generator")
        
        # Test the generation
        print("🔄 Generating Writing Task 1...")
        task = await generator.generate_writing_task1()
        
        print("✅ Generation completed successfully!")
        
        # Validate the task structure
        print("🔍 Validating task structure...")
        
        assert isinstance(task, WritingTask1), f"Expected WritingTask1, got {type(task)}"
        print("  ✅ Task is WritingTask1 instance")
        
        assert hasattr(task, 'task_id'), "Task missing task_id"
        print(f"  ✅ Task ID: {task.task_id}")
        
        assert hasattr(task, 'scenario'), "Task missing scenario"
        print(f"  ✅ Scenario: {task.scenario.title}")
        
        assert task.time_limit_minutes == 27, f"Expected 27 minutes, got {task.time_limit_minutes}"
        print(f"  ✅ Time limit: {task.time_limit_minutes} minutes")
        
        assert task.word_count_min == 150, f"Expected 150 min words, got {task.word_count_min}"
        assert task.word_count_max == 200, f"Expected 200 max words, got {task.word_count_max}"
        print(f"  ✅ Word count: {task.word_count_min}-{task.word_count_max} words")
        
        # Validate scenario details
        scenario = task.scenario
        assert hasattr(scenario, 'scenario_id'), "Scenario missing scenario_id"
        assert hasattr(scenario, 'title'), "Scenario missing title"
        assert hasattr(scenario, 'context'), "Scenario missing context"
        assert hasattr(scenario, 'recipient'), "Scenario missing recipient"
        assert hasattr(scenario, 'purpose'), "Scenario missing purpose"
        assert hasattr(scenario, 'key_points'), "Scenario missing key_points"
        assert hasattr(scenario, 'tone'), "Scenario missing tone"
        assert hasattr(scenario, 'relationship'), "Scenario missing relationship"
        
        print(f"  ✅ Scenario ID: {scenario.scenario_id}")
        print(f"  ✅ Title: {scenario.title}")
        print(f"  ✅ Recipient: {scenario.recipient}")
        print(f"  ✅ Purpose: {scenario.purpose}")
        print(f"  ✅ Tone: {scenario.tone}")
        print(f"  ✅ Relationship: {scenario.relationship}")
        print(f"  ✅ Key points count: {len(scenario.key_points)}")
        
        assert len(scenario.key_points) > 0, "Scenario should have key points"
        assert len(scenario.context) > 50, "Context should be detailed"
        
        print("🎉 All validations passed!")
        
        # Print full task details
        print("\n📋 Generated Task Details:")
        print(f"Task ID: {task.task_id}")
        print(f"Scenario: {scenario.title}")
        print(f"Context: {scenario.context[:100]}...")
        print(f"Recipient: {scenario.recipient}")
        print(f"Purpose: {scenario.purpose}")
        print(f"Tone: {scenario.tone}")
        print(f"Key Points:")
        for i, point in enumerate(scenario.key_points, 1):
            print(f"  {i}. {point}")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def test_json_parsing():
    """Test JSON parsing with the mock response"""
    print("\n🧪 Testing JSON Parsing...")
    
    try:
        mock_provider = MockLLMProvider()
        generator = CELPIPGenerator(mock_provider)
        
        # Get the raw response
        raw_response = await mock_provider.generate_content("test prompt")
        print(f"✅ Raw response length: {len(raw_response)}")
        
        # Test the JSON extraction logic
        json_start = raw_response.find('{')
        json_end = raw_response.rfind('}') + 1
        
        print(f"✅ JSON start index: {json_start}")
        print(f"✅ JSON end index: {json_end}")
        
        if json_start == -1 or json_end == 0:
            raise ValueError("No valid JSON found in response")
        
        json_str = raw_response[json_start:json_end]
        print(f"✅ Extracted JSON length: {len(json_str)}")
        
        data = json.loads(json_str)
        print("✅ JSON parsed successfully")
        
        # Test the ID fixing logic
        print("🔄 Testing ID fixing...")
        
        # Before ID fix
        print(f"Before ID fix - keys: {list(data.keys())}")
        
        # Apply ID fix (simulating the _ensure_question_ids method)
        if "task_id" not in data:
            import uuid
            data["task_id"] = str(uuid.uuid4())
            print(f"✅ Added task_id: {data['task_id']}")
        
        if "scenario" in data and isinstance(data["scenario"], dict):
            if "scenario_id" not in data["scenario"]:
                import uuid
                data["scenario"]["scenario_id"] = str(uuid.uuid4())
                print(f"✅ Added scenario_id")
        
        print(f"After ID fix - keys: {list(data.keys())}")
        
        # Test creating the model
        print("🔄 Testing model creation...")
        task = WritingTask1(**data)
        print("✅ WritingTask1 model created successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ JSON parsing test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def test_prompt_generation():
    """Test prompt generation"""
    print("\n🧪 Testing Prompt Generation...")
    
    try:
        from app.services.prompts.writing_prompts import WritingTaskPrompts
        
        print("🔄 Generating prompt...")
        prompt = WritingTaskPrompts.create_task1_prompt()
        
        print(f"✅ Prompt generated, length: {len(prompt)}")
        print(f"✅ Contains JSON template: {'```json' in prompt}")
        print(f"✅ Contains scenario_id: {'scenario_id' in prompt}")
        print(f"✅ Contains key_points: {'key_points' in prompt}")
        
        # Print first 500 characters of prompt
        print(f"\n📝 Prompt preview:\n{prompt[:500]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Prompt generation test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Run all tests"""
    print("🚀 Starting Writing Task 1 Testing Suite\n")
    
    tests = [
        ("Prompt Generation", test_prompt_generation),
        ("JSON Parsing", test_json_parsing),
        ("Writing Task 1 Generation", test_writing_task1_generation),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*60}")
        print(f"Running: {test_name}")
        print('='*60)
        
        try:
            success = await test_func()
            if success:
                print(f"✅ {test_name} PASSED")
                passed += 1
            else:
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            print(f"❌ {test_name} FAILED with exception: {str(e)}")
    
    print(f"\n{'='*60}")
    print(f"📊 Test Results: {passed}/{total} tests passed")
    print('='*60)
    
    if passed == total:
        print("🎉 All tests passed! Writing Task 1 is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    return passed == total


if __name__ == "__main__":
    asyncio.run(main())