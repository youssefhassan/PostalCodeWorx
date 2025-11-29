# PostalCodeWorx - Product Plan

> Building hyperlocal communities, one postal code at a time.

## 🎯 Vision

PostalCodeWorx is a community platform that connects neighbors through their postal code. Starting with Berlin, we're building tools that strengthen local communities while creating an alternative to Big Tech's grip on local data.

---

## 🏗️ Platform Architecture

```mermaid
graph TB
    subgraph "PostalCodeWorx Platform"
        A[🏠 PostalCodeWorx.com] --> B[🧤 Lost & Found]
        A --> C[📸 Neighborhood Gallery]
        A --> D[🤝 Local Collabs]
        A --> E[🪙 Postaal Economy]
    end
    
    subgraph "Core Services"
        F[🤖 Claude AI] --> B
        F --> C
        F --> D
        G[📍 Location Verification] --> B
        G --> C
        G --> D
        H[🗄️ PostgreSQL] --> B
        H --> C
        H --> D
    end
    
    subgraph "Marketing Domains"
        I[ifoundglove.com] -.-> B
        J[myhood.pics] -.-> C
        K[neighborpro.com] -.-> D
    end
```

---

## 🛣️ Feature Roadmap

```mermaid
gantt
    title PostalCodeWorx Roadmap
    dateFormat  YYYY-MM
    section Phase 1 - MVP
    Glove Finder (Lost & Found)     :done, 2024-11, 2024-12
    Claude AI Integration           :done, 2024-11, 2024-12
    Berlin Postal Code Validation   :done, 2024-11, 2024-12
    
    section Phase 2 - Gallery
    Photo Upload & Verification     :2024-12, 2025-01
    AI Location Confidence Score    :2024-12, 2025-01
    Community Voting & Competitions :2025-01, 2025-02
    
    section Phase 3 - Collabs
    Service Provider Profiles       :2025-02, 2025-03
    Address Verification System     :2025-02, 2025-03
    Booking & Reviews               :2025-03, 2025-04
    
    section Phase 4 - Economy
    Postaal Coin Launch             :2025-04, 2025-05
    Rewards & Spending              :2025-04, 2025-06
    Crypto Bridge (optional)        :2025-06, 2025-08
```

---

## 🧤 Feature 1: Lost & Found

**Status:** ✅ MVP Complete

### User Flow

```mermaid
sequenceDiagram
    participant Finder
    participant App
    participant Claude AI
    participant Owner
    
    Finder->>App: Upload photo of found item
    App->>Claude AI: Analyze image
    Claude AI-->>App: Brand, color, size, condition
    App->>App: Store with postal code
    
    Owner->>App: Search by postal code + filters
    App-->>Owner: Show matching items
    Owner->>App: Pay finder's fee
    App->>App: Take 20% platform fee (EUR only)
    App->>Finder: Forward message + payment
    Finder->>Owner: Arrange meetup
```

### Features
- [x] Photo upload with AI analysis
- [x] Claude detects: brand, color, size, material, condition
- [x] Dynamic confidence scoring
- [x] Search by postal code, color, brand, date
- [x] Finder's fee (Postaal coins or EUR)
- [x] 20% platform fee on EUR transactions
- [x] Spam reporting & moderation
- [ ] Expand beyond gloves (keys, bags, phones, etc.)

---

## 📸 Feature 2: Neighborhood Gallery

**Status:** 🔜 Next Up

### Vision
A community-driven photo gallery of Berlin neighborhoods. Every photo is verified to be from the claimed postal code, creating an authentic visual record owned by the community—not Google or Meta.

### User Flow

```mermaid
sequenceDiagram
    participant Local
    participant App
    participant Claude AI
    participant Community
    
    Local->>App: Upload neighborhood photo
    App->>Claude AI: Analyze image
    
    Note over Claude AI: Check for:<br/>1. Street scene (not selfie)<br/>2. Weather matches date<br/>3. Recognizable landmarks<br/>4. No spam/ads
    
    Claude AI-->>App: Confidence score + analysis
    App->>App: Store with 50% initial score
    
    Community->>App: Upvote / Report
    App->>App: Adjust confidence score
    
    alt Score > 70%
        App->>App: Feature in gallery
    else Score < 30%
        App->>App: Remove from gallery
    end
```

### Confidence Scoring

```mermaid
pie title Photo Confidence Score Components
    "Valid street/outdoor scene" : 25
    "GPS metadata matches postal code" : 20
    "Weather matches date/location" : 15
    "User history in this area" : 15
    "Community upvotes" : 15
    "No spam/ads detected" : 10
```

### Features
- [ ] Photo upload with location claim
- [ ] AI verification (street scene, weather, landmarks)
- [ ] GPS metadata extraction (if available)
- [ ] Confidence score display on each photo
- [ ] Community upvotes/downvotes
- [ ] Report spam/wrong location
- [ ] Weekly/monthly competitions per postal code
- [ ] Leaderboard: "Best photographers of 10115"
- [ ] Photo licensing for local businesses (future revenue)

---

## 🤝 Feature 3: Local Collabs

**Status:** 🔮 Future

### Vision
Find trusted local service providers—artists, handymen, tutors, pet sitters—who actually live in your neighborhood. Verified by address, rated by neighbors.

### User Flow

```mermaid
sequenceDiagram
    participant Provider
    participant App
    participant Verification
    participant Neighbor
    
    Provider->>App: Sign up as service provider
    App->>Verification: Request address proof
    
    Note over Verification: Options:<br/>1. Utility bill upload<br/>2. Postcard with code<br/>3. Bank statement
    
    Verification-->>App: Address verified ✓
    App->>App: Add to local provider list
    
    Neighbor->>App: Search "handyman in 10115"
    App-->>Neighbor: Show verified providers
    Neighbor->>Provider: Book service
    Provider->>Neighbor: Complete job
    Neighbor->>App: Leave review
    App->>Provider: Award Postaal coins
```

### Features
- [ ] Service provider profiles
- [ ] Address verification system
- [ ] Categories: Art, Repairs, Tutoring, Pet care, etc.
- [ ] Availability calendar
- [ ] Booking system
- [ ] Reviews & ratings (neighbors only)
- [ ] Postaal coin payments
- [ ] "Neighbor discount" system

---

## 🪙 Postaal Economy

### Token Flow

```mermaid
flowchart LR
    subgraph Earning
        A[📸 Upload verified photo] --> E[🪙 +1 Postaal]
        B[🧤 Return lost item] --> F[🪙 +5 Postaal]
        C[⭐ Get upvotes] --> G[🪙 +1 per 10 votes]
        D[🚨 Report confirmed spam] --> H[🪙 +2 Postaal]
    end
    
    subgraph Spending
        E --> I[💬 Contact finder]
        F --> I
        G --> J[⬆️ Boost your listing]
        H --> K[🏆 Enter competitions]
    end
    
    subgraph Future
        I --> L[💱 Convert to EUR]
        J --> L
        K --> M[🔗 Crypto bridge]
    end
```

### Economics
| Action | Postaal Earned/Spent |
|--------|---------------------|
| Sign up | +10 (welcome bonus) |
| Upload verified photo | +1 |
| Photo gets 10 upvotes | +1 |
| Return a lost item | +5 |
| Report confirmed spam | +2 |
| Contact a finder | -varies (finder sets) |
| Boost listing | -5 |
| Enter competition | -2 |

---

## 🌍 Expansion Plan

```mermaid
graph LR
    subgraph "Phase 1: Berlin"
        A[10115 Mitte] --> B[10178 Alexanderplatz]
        B --> C[10997 Kreuzberg]
        C --> D[All Berlin PLZ]
    end
    
    subgraph "Phase 2: Germany"
        D --> E[Hamburg 2xxxx]
        E --> F[Munich 8xxxx]
        F --> G[All Germany]
    end
    
    subgraph "Phase 3: Europe"
        G --> H[Vienna]
        H --> I[Amsterdam]
        I --> J[More cities...]
    end
```

### Postal Code Format by Country
| Country | Format | Example |
|---------|--------|---------|
| 🇩🇪 Germany | 5 digits | 10115 |
| 🇦🇹 Austria | 4 digits | 1010 |
| 🇳🇱 Netherlands | 4 digits + 2 letters | 1012 AB |
| 🇬🇧 UK | Alphanumeric | SW1A 1AA |

---

## 💰 Revenue Streams

```mermaid
pie title Revenue Model
    "Platform fees (20% on EUR)" : 40
    "Featured listings" : 20
    "Photo licensing" : 15
    "Premium provider profiles" : 15
    "Competitions sponsorship" : 10
```

1. **Platform Fees** - 20% on EUR transactions (finder's fees, services)
2. **Featured Listings** - Pay to boost visibility
3. **Photo Licensing** - Local businesses license community photos
4. **Premium Profiles** - Service providers pay for verified badges
5. **Sponsored Competitions** - Local businesses sponsor photo contests

---

## 🛡️ Trust & Safety

### AI Moderation (Claude)
- Spam detection
- Inappropriate content filtering
- Fake listing detection
- Location verification

### Community Moderation
- Upvote/downvote system
- Report functionality
- Confidence score decay on reports
- Auto-removal below 30% confidence

### Address Verification (for Collabs)
- Utility bill upload
- Postcard verification
- Bank statement verification

---

## 📱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| AI | Anthropic Claude API |
| Hosting | Render |
| Storage | Render Disk (images) |
| Future | Redis (caching), S3 (scale images) |

---

## 🚀 Next Steps

1. **Now:** Polish Lost & Found MVP, gather feedback
2. **Next:** Build Gallery feature with AI verification
3. **Then:** Launch Postaal coin economy
4. **Later:** Add Local Collabs with address verification
5. **Future:** Expand to more cities, explore crypto bridge

---

*Built with ❤️ for Berlin neighborhoods*

