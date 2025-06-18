# 🎓 Online Learning Platform with NFT Certificate Verification

A full-stack application that enables learners to join online courses and receive NFT-based certificates stored and verified on the Ethereum Sepolia testnet. This project was built as part of a graduation thesis at the University of Sciences, Hue University.

---

## 📚 Overview

The platform aims to provide a reliable and interactive online learning experience, combining:

* Course management system for learners and instructors.
* NFT-based certification with verification on-chain.
* Use of blockchain (Sepolia), IPFS, and AI Assistant.
* Real-time updates and decentralized storage for integrity and transparency.

---

## ✨ Features

### Learners:

* Register & login securely
* Browse, enroll in courses
* Track learning progress
* Receive NFT certificates
* Validate certificate authenticity on-chain

### Instructors:

* Apply to become an instructor
* Create, update, and publish courses & lessons

### Admin:

* Manage users, courses, categories
* Review instructor applications
* View platform analytics

### NFT Certification:

* Issued as ERC-721 tokens
* Metadata stored on IPFS
* Soulbound (non-transferable)
* Verifiable on the Sepolia blockchain

---

## 🧰 Tech Stack

| Layer        | Technologies                       |
| ------------ | ---------------------------------- |
| Frontend     | Next.js, Tailwind CSS, TypeScript  |
| Backend      | Spring Boot, PostgreSQL, Firestore |
| Blockchain   | Solidity, Hardhat, Sepolia Testnet |
| Storage      | AWS S3, IPFS (Pinata)              |
| DevOps       | Docker, Docker Compose             |
| AI Assistant | Gemini Generative Language API     |

---

## 🏠 System Architecture

![Screenshot 2025-06-18 194914](https://github.com/user-attachments/assets/b295bbf1-8c43-4bc7-aa5b-cbe6cd64bd9a)

---

## 🚀 Quick Start

### 🌐 Local Development

```bash
docker-compose up --build
```

### 🔋 Deploy Smart Contracts

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🖊️ Smart Contracts

### Features:

* ERC-721 standard
* Metadata stored on IPFS
* Hash verification for integrity

### Example:

```solidity
function verifyMetadataHash(bytes32 hash) external view returns (bool) {
    return _usedHashes[hash];
}
```

---

## 📅 Certificate Lifecycle
![Screenshot 2025-06-18 195304](https://github.com/user-attachments/assets/8e31051b-8cda-40e8-af18-69aa0f87d20d)
1. Learner completes course
2. System generates metadata + image
3. Uploads to IPFS via Pinata
4. Mints NFT using `mint()` in smart contract
5. Metadata hash stored on-chain
6. Learner receives certificate in wallet
7. Verifier hashes metadata & checks on-chain

---

## 📖 Thesis Reference

> "Xây dựng Website cung cấp khóa học trực tuyến và ứng dụng blockchain để lưu trữ chứng chỉ trên mạng lưới Sepolia"
>
> * Author: Mai Tiến Dũng, K45 - IT
> * Advisor: Dr. Nguyễn Văn Trung
> * Hue University of Sciences, June 2025

---

## 📄 License

This project is for educational purposes only and not intended for production use.

---

## ✨ Acknowledgments

* Etherscan, Pinata, Alchemy
* Gemini API by Google
* Spring, Hardhat, Next.js communities
