# BrokerBot Mobile

AI teammates for real estate agents — a production-ready native mobile suite for **iOS (Swift/SwiftUI)** and **Android (Kotlin/Jetpack Compose)**. This repository also ships an **interactive React prototype** (the running web demo) that mirrors the native UX so product, design, and stakeholders can experience every flow in the browser before/while the native apps are built.

## 1. Project Overview
BrokerBot Mobile gives field agents an always-on AI teammate plus the tools they need on the go:
- **Authentication** — secure login/signup, optional 2FA, biometric (Face ID / fingerprint), role-based access (agent/admin), offline credential cache.
- **AI Chat & Workflow** — real-time streaming AI responses, contextual quick actions, voice-to-text input, AI insight notifications.
- **Document Scanner** — camera capture with edge-detection overlay, AI OCR text extraction, compliance check, scan history.
- **Dashboard** — active listings, upcoming appointments, AI recommendations, task completion ring.
- **Listings & Clients** — property CRUD, favorites, rich detail view, client profiles with call/text/email, interaction history.
- **Notifications & Alerts** — deadlines, compliance reminders, market updates, AI insights.
- **Offline Knowledge Base** — searchable cached articles, recommendations, and notes that work without a connection.

## 2. iOS (Swift / SwiftUI) Setup
```bash
# Requirements: Xcode 15+, iOS 16+ target, Swift 5.9
git clone <repo> && cd brokerbot-ios
open BrokerBot.xcodeproj
```
- Architecture: **MVVM** (`Views/`, `ViewModels/`, `Models/`, `Services/`).
- Dependencies via Swift Package Manager: `Alamofire` (REST), `Starscream` (WebSocket), `KeychainAccess` (secure token), `Firebase/Messaging` (push).
- Set `API_BASE_URL` in `Config.xcconfig`.
- Local persistence with **Core Data** (`BrokerBot.xcdatamodeld`).

## 3. Android (Kotlin / Jetpack Compose) Setup
```bash
# Requirements: Android Studio Iguana+, JDK 17, minSdk 26
git clone <repo> && cd brokerbot-android
./gradlew assembleDebug
```
- Architecture: **MVVM** with `ViewModel` + `StateFlow` + Compose.
- Dependencies: `Retrofit`/`OkHttp` (REST + WebSocket), `Room` (offline DB), `DataStore` (prefs/token), `firebase-messaging` (push), `CameraX` + `ML Kit Text Recognition` (scanner OCR).
- Set `API_BASE_URL` in `local.properties` / `BuildConfig`.

## 4. Backend API Integration
RESTful JSON over HTTPS. Bearer token auth.
```
POST   /api/auth/login         POST /api/auth/signup        POST /api/auth/logout
GET    /api/properties         POST /api/properties         PATCH /api/properties/:id   DELETE /api/properties/:id
GET    /api/clients            POST /api/clients            PATCH /api/clients/:id
POST   /api/documents/upload   GET  /api/documents/:propertyId
POST   /api/ai/send-message    GET  /api/ai/conversation/:id
GET    /api/notifications      POST /api/notifications/send  PATCH /api/notifications/:id/read
```
The prototype's AI is powered by a Supabase Edge Function (`ai-chat`) that proxies an LLM via a secure gateway — no API keys in the client.

## 5. WebSocket Streaming for AI
- Native apps open a WS/SSE connection to `/api/ai/stream`.
- Tokens are appended to the active assistant bubble as they arrive (see `AIChatViewModel`).
- The web prototype simulates token streaming after a single REST round-trip for fidelity.

## 6. Push Notifications
- **iOS:** APNs via Firebase Cloud Messaging. Register in `AppDelegate`, upload APNs key to Firebase, request authorization in onboarding.
- **Android:** FCM via `FirebaseMessagingService`; create notification channels for `deadlines`, `compliance`, `market`, `insights`.

## 7. Offline-First Caching Strategy
- Core Data (iOS) / Room (Android) cache last 100 properties, 50 clients, 200 messages, KB articles.
- Repository pattern: read from cache first, revalidate from network, queue mutations while offline and replay on reconnect.
- Sync status surfaced in the UI (Online/Offline pill + "synced Xm ago").

## 8. Document Scanner Integration
- iOS: `VisionKit` `VNDocumentCameraViewController` + `Vision` text recognition.
- Android: `CameraX` + `ML Kit` document scanner & text recognition.
- Extracted text is run through a compliance check and saved to the property record.

## 9. Deployment
- **iOS:** Archive in Xcode → upload to App Store Connect → distribute via **TestFlight** → submit for review.
- **Android:** `./gradlew bundleRelease` → upload AAB to **Play Console** → internal testing → production.

## 10. Suggested MVP Timeline
- **Week 1:** Auth + dashboard + AI chat placeholder
- **Week 2:** Document scanner + OCR + property CRUD
- **Week 3:** Client management + listings + offline caching
- **Week 4:** Notifications + push setup
- **Week 5:** Real-time AI streaming integration
- **Week 6:** Polish + QA + deployment prep

---
### Running the web prototype
```bash
npm install && npm run dev
```
Toggle between iPhone and Android frames, sign in (or use Face ID demo), and explore every screen.
