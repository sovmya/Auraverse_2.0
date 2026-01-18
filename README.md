Universal Clipboard Sync
Overview

This project explores a cross-platform clipboard synchronization system that allows devices to share clipboard content in near real-time.

The focus of this prototype is on system design, communication flow, and synchronization logic, rather than a polished UI.

Problem

Clipboard sharing across different operating systems is fragmented, platform-locked, or unreliable.

We aim to design a system that:

Works across devices

Uses secure peer-to-peer communication

Handles offline cases gracefully

Avoids data conflicts

Architecture

The system is designed using:

WebSocket – for signaling and device discovery

WebRTC DataChannels – for low-latency peer-to-peer communication

Timestamp-based sync logic – to resolve clipboard conflicts

Queueing mechanism – to handle offline devices

High-level flow:

Device registers with signaling server

Devices pair

WebRTC connection is established

Clipboard changes are synced in real time

Offline updates are queued and replayed

Current Status

Signaling server implemented

Message protocol designed

Clipboard sync logic defined

UI / client integration in progress

Prototype not fully wired end-to-end

This repository represents the core system design and logic of the project.

Notes

This project prioritizes correctness of architecture and scalability over UI completeness.
The remaining work primarily involves client-side integration.
