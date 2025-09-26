# Name

- Laundry Queue

# Users

- Users are students and faculty living in campus housing who need to wash their laundry in the shared dorm laundry machines.

# Value proposition

A lightweight, web app that shows real-time machine availability, lets students check in a running load (with expected cycle time), notifies owners when their cycle finishes, and enables polite reminder requests when machines are idle but still occupied — reducing forgotten loads, wasted trips, and wait-time conflict.

# Key features

Simple one-screen layout showing all machines with clear color coding and timers:

- Machine grid/list with each machine labeled (e.g., W1, W2, D1).
  - **Green** = available / empty.
  - **Red** = in-use (a timer displayed, counting down to completion).
  - Blinking **Red** =  finished washing/drying but still occupied.
- Check-in flow:
  - Tap a machine matching the machine label → enter expected cycle duration (default 30–45 min) → “Start” logs the check-in and starts the timer.
- Notifications:
  - When a machine’s timer reaches zero, the app sends a local/push notification to the user who checked in.
  - Any other user can tap a machine that’s occupied and send a polite reminder notification to the current owner to pick up laundry.
  - Reminder limit so that people can't spam the current owner. 
- Real-time updates:
  - Machines update in real time for all users (WebSocket or short polling fallback).
- Lightweight logging:
  - At the end of each cycle (or on user actions), log timestamp, machine id, duration, user id, and final action (picked up / left clothes) to the console/backend.
- Data cleanup:
  - Removes old data from database after 3 weeks. 

# Example scenario

- Sam, Priya, and Lee live on the same floor with 2 washers.
- Sam starts washer W1 and checks in with a 35-minute cycle from his phone
- W1 turns red and shows a 35:00 countdown on everyone’s app.
- Priya starts washer W2 and checks in with a 45-minute cycle from her phone.
- W2 turns red and shows a 45:00 countdown on everyone’s app.
- Lee arrives and sees both machines occupied but still have clothing left inside. She taps W2 and sends a reminder to Sam that his laundry is done.
- Sam receives the reminder notification, picks up his clothes, marks W1 as available, and the machine switches to green.
- Lee watches the grid, sees that W1 is free, claims W1 for a 30-minute cycle, and the cycle begins.

# Coding notes

- Frontend:
  - Single-page web UI; show machine status, remaining time, and action buttons on one screen.
  - Use `setInterval()` (or `requestAnimationFrame` for UI smoothing) to update local countdowns; rely on server timestamps for authoritative finish times to avoid client clock drift.
  - Use Service Worker / Push API (or Firebase Cloud Messaging) for notifications on mobile/web.
  - Real-time sync via WebSockets (Socket.IO) or polling if sockets unavailable.
- Backend:
  - Simple REST + WebSocket backend storing machine states: `{ machineId, state, ownerId, startTime, duration, claimed }`.
  - Use atomic updates / optimistic locking when claiming or finishing a machine to avoid races.
  - Send push notifications via a push provider when timers complete.
- Sound/alerts:
  - Play short alert using the Web Audio API for local audible alerts (mockable during tests).
- Testability:
  - Abstract push/notification service behind an interface so it can be replaced by a `MockPushService` in tests.
  - Keep timestamps in ISO UTC; server is source of truth for finish times.

# Testing notes

Unit & integration tests should cover:

- Check-in flow: starting a machine updates state, sets owner, and computes finish time correctly.
- Timer expiration: when server finish time passes, notification is queued/sent and machine switches to "finished" state.
- Reminder flow: sending a reminder creates a notification delivered to the owner; ensure throttling to prevent spam.
- UI state colors: green/red/claimed states display correctly in various edge cases.
- Concurrency: two users attempting to claim the same machine — ensure only one succeeds (atomicity).
- Edge cases:
  - User edits duration mid-cycle.
  - User loses connection and reconnects — state resync works.
  - Time skew between client and server — server-driven finish times used.
- Mocks & test helpers:
  - `MockPushService` / `MockNotificationAPI` to assert notifications without external services.
  - `MockClock` or frozen `Date` to simulate time passage and trigger timer-completion logic deterministically.
- End-to-end:
  - Simulate multiple users on different clients to verify real-time updates and reminder delivery.

# Recording-keeping

- Log events (console/backend) with `{ timestamp, machineId, action, userId, duration, result }` for auditing and optional usage analytics (e.g., average occupancy, frequent violators).