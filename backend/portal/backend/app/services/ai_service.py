from datetime import date

from sqlalchemy.orm import Session

from app.ai.tools import (
    complete_user_task,
    create_user_task,
    get_user_tasks,
)


def generate_ai_response(message: str) -> str:
    """
    Fallback conversational response.
    Used when the request does not match an available tool.
    """

    text = message.strip()

    if not text:
        return "Please send a message to start the chat."

    return (
        f'I received your message: "{text}". '
        "I can help with task tracking, revision planning, "
        "and study summaries."
    )


def process_ai_request(
    db: Session,
    user_id: int,
    message: str,
) -> str:

    text = message.lower().strip()

    if not text:
        return "Please send a message to start the chat."

    # =========================================
    # GET TASKS
    # =========================================

    if (
        "my tasks" in text
        or "show tasks" in text
        or "list tasks" in text
        or "what are my tasks" in text
    ):
        tasks = get_user_tasks(
            db=db,
            user_id=user_id,
        )

        if not tasks:
            return "You don't have any tasks yet."

        result = ["Your tasks:"]

        for task in tasks:
            result.append(
                f"- {task.task_title} "
                f"({task.status}) "
                f"— {task.scheduled_date}"
            )

        return "\n".join(result)

    # =========================================
    # CREATE TASK
    # =========================================

    prefixes = [
        "create task",
        "add task",
        "make task",
        "create a task",
        "add a task",
        "make a task",
    ]

    for prefix in prefixes:

        if text.startswith(prefix):

            title = message[len(prefix):].strip()

            if not title:
                return "Please tell me the task name."

            task = create_user_task(
                db=db,
                user_id=user_id,
                task_title=title,
                scheduled_date=date.today(),
            )

            return (
                f"Done. I created the task "
                f"'{task.task_title}' for today."
            )

    # =========================================
    # COMPLETE TASK
    # =========================================

    if (
        text.startswith("complete task")
        or text.startswith("finish task")
        or text.startswith("mark task complete")
    ):
        return (
            "I can complete tasks, but I need the task "
            "selection logic connected next."
        )

    # =========================================
    # FALLBACK
    # =========================================

    return generate_ai_response(message)