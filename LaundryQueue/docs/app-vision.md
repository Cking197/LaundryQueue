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

## Frontend
- **Single-page UI**:
  - Show machine grid/list (W1, W2, etc.).
  - Each machine displays:
    - **Green** if available.  
    - **Red with countdown** if in use.  
    - **Blinking Red** if timer has expired but user hasn’t marked it done.  

- **Check-in flow**:
  - Tap a machine → enter expected cycle duration → machine switches to Red and countdown starts.  

- **Local timers**:
  - Use `setInterval()` to update countdowns every second.  
  - When timer hits zero, machine switches to **Blinking Red** until user marks it as empty.  

- **Manual update controls**:
  - “Mark as Empty” button turns machine back to Green.  

- **Data persistence (optional)**:
  - Store machine state in `localStorage` so it survives page reloads.  

## Backend (Optional / Minimal)
- Could skip backend entirely for MVP → use local state only. 
- If backend included:
  - Store machine states in a simple JSON DB or SQLite:  
    ```json
    { "machineId": "W1", "state": "in-use", "owner": "user123", "startTime": "2025-09-26T12:00:00Z", "duration": 40 }
    ```
  - Provide REST endpoints:
    - `GET /machines` → list machine states.  
    - `POST /machines/:id/start` → claim machine with duration.  
    - `POST /machines/:id/finish` → mark machine empty.  

# Testing notes
- Verify that starting a machine sets countdown correctly.  
- Verify that timer decrements and flips to “finished” state at zero.  
- Verify that “Mark as Empty” resets machine to green.  
- Test edge cases:  
  - Two users trying to start the same machine.  
  - Refreshing the page (state persists via `localStorage`).  
# Recording-keeping

- Log events (console/backend) with `{ timestamp, machineId, action, userId, duration, result }` for auditing and optional usage analytics (e.g., average occupancy, frequent violators).