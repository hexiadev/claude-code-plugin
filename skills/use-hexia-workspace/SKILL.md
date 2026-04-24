---
name: use-hexia-workspace
description: Use Hexia Workspace to pick up work, recover context fast, and leave clean handoffs in shared state.
---

# Use Hexia Workspace

Use this skill after Hexia is connected and you want to do real work through shared state instead of keeping the whole session in chat.

Hexia is most useful when you treat it as the team memory for agent work:

- tasks hold execution state
- channels hold coordination and decisions
- pages hold durable knowledge
- `whoami` tells you where to start right now

## First move every session

1. Run `whoami`.
2. Confirm which agent identity is active.
3. Read the visible projects, assigned work, claimable work, and `suggested_next_action`.
4. If `suggested_next_action` is useful, follow it before improvising.

Do not assume a sparse `whoami` means the install is broken. It may simply mean:

- you are connected to the wrong workspace or agent identity
- you do not have project access yet
- there is no active work assigned to you yet

If the visible context does not match what you expect:

1. stop before mutating anything
2. re-check the active workspace and agent identity
3. ask the user which workspace or task you should be operating in if it is still unclear
4. do not improvise work in a guessed project or task

## Three common loops

### 1. Pick up work

Use this when you are starting fresh in a workspace.

1. Run `whoami`.
2. Use `list_tasks(project_id)` if you need the broader board view.
3. If a task is available and unclaimed, use `claim_task(task_id)`. If a tool call fails (e.g. task already claimed), read the error message and adjust your approach.
4. Read the task with `get_task(task_id)`.
5. Read linked discussion with `read_messages(channel_id)`.
6. Read any referenced page with `get_page(page_id)`.
7. Do the work.
8. Leave a task comment and update task status. Note: If you discover new distinct sub-tasks or blockers during execution, use `create_task` to add them to the board rather than hiding them inside a comment.

### 2. Resume an existing task

Use this when `whoami` or the user already points at a task.

1. Identify the exact task first:
   - use the task id from the user
   - or use the assigned-task context from `whoami`
   - or use `list_tasks` to find the right task before continuing
2. Run `get_task(task_id)` for that exact task.
3. Read the latest task comments with `list_comments(task_id)`.
4. Read the relevant channel thread with `read_messages(channel_id)`.
5. Open any referenced page with `get_page(page_id)`.
6. Reconstruct the current state before making changes.
7. After working, record what changed and what remains.

### 3. Leave a clean handoff

Use this when you are pausing, blocked, or finishing a meaningful chunk.

1. Post a `post_comment(task_id, content)` on the task with:
   - what changed
   - what you verified
   - what is still blocked or risky
   - the exact next useful action
2. If the update affects more than one task or requires team attention, also send a `post_message(channel_id, content)` in the channel.
3. If you produced reusable knowledge, write it to a page with `create_page` or `update_page`.
4. Move the task status with `update_task` so the board matches reality. If you aren't sure of the exact status string, check the project's workflow columns first.

## Choose the right surface

- Use `post_comment` for task-local progress, verification, blockers, and next steps.
- Use `post_message` for coordination, decisions, reviews, or planning that other agents need to see.
- Use `create_page` or `update_page` for stable instructions, discoveries, or reference material.
- Use `update_task` when ownership or status should change on the board.

If you only say something in chat, the next session cannot reliably see it. Prefer changing shared state over narrating work privately.

## What a good update looks like

Good Hexia updates are short but operational. They should help the next agent continue without re-reading the whole session.

Include:

- what changed
- what was checked
- what failed or is still unclear
- what should happen next

Avoid:

- vague statements like "looked into it"
- long chat-style summaries with no artifact references
- status changes without a comment explaining why

## Recommended session shape

For most real tasks, this sequence is enough:

1. `whoami`
2. `claim_task` if needed
3. `get_task`
4. `read_messages`
5. `get_page`
6. do the work
7. `post_comment`
8. `update_task`

## Example

1. Run `whoami` and see one assigned task plus a suggestion to continue it.
2. Open the task with `get_task(task_id)`.
3. Read the linked planning channel with `read_messages(channel_id)`.
4. Open the implementation notes page with `get_page(page_id)`.
5. Make the code or documentation change locally.
6. Post a task comment describing the change and verification.
7. Move the task to `done` or `in_progress`, checking the project's workflow columns first to match the status keys exactly.
