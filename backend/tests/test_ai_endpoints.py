import unittest

from fastapi import HTTPException

from app.main import (
    AIChatPayload,
    AIEmbeddingsPayload,
    AIRecommendationsPayload,
    AISummaryPayload,
    ai_recommendations,
    chat_with_ai,
    create_embedding_job,
    get_ai_context,
    summarize_activity,
)


class TestAIEndpoints(unittest.TestCase):
    def test_get_ai_context_returns_context_for_demo_user(self):
        response = get_ai_context("Bearer demo-token")
        self.assertEqual(response["user"]["id"], 1)
        self.assertEqual(response["user"]["username"], "demo_user")
        self.assertIn("tasks", response)
        self.assertIn("notes", response)
        self.assertIn("calendar_events", response)
        self.assertIn("revisions", response)
        self.assertIn("chat_history", response)

    def test_chat_with_ai_returns_reply(self):
        payload = AIChatPayload(message="What should I study tomorrow?")
        response = chat_with_ai(payload, "Bearer demo-token")
        self.assertIn("reply", response)
        self.assertIsInstance(response["reply"], str)

    def test_summarize_activity_returns_worth_score(self):
        payload = AISummaryPayload()
        response = summarize_activity(payload, "Bearer demo-token")
        self.assertIn("summary", response)
        self.assertIn("worth_score", response)
        self.assertIsInstance(response["worth_score"], float)

    def test_ai_recommendations_returns_advice(self):
        payload = AIRecommendationsPayload(question="What should I work on?")
        response = ai_recommendations(payload, "Bearer demo-token")
        self.assertIn("advice", response)
        self.assertIsInstance(response["advice"], str)

    def test_create_embedding_job_requires_file_id(self):
        payload = AIEmbeddingsPayload()
        with self.assertRaises(HTTPException):
            create_embedding_job(payload, "Bearer demo-token")

    def test_create_embedding_job_queues_job(self):
        payload = AIEmbeddingsPayload(file_id=123)
        response = create_embedding_job(payload, "Bearer demo-token")
        self.assertEqual(response["status"], "queued")
        self.assertIsInstance(response["job_id"], int)


if __name__ == "__main__":
    unittest.main()
