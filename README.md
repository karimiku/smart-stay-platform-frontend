# Smart Stay Platform Frontend

Smart Stay Platform のフロントエンドアプリケーションです。Next.js、React、TypeScript を使用して構築されています。


![Smart Stay Platform Home](./public/home.png)

## 📖 プロジェクト概要

Smart Stay Platform は、スマートヴィラ予約プラットフォームのフロントエンドアプリケーションです。ゲストとオーナー向けのダッシュボード、予約管理、デジタルキー管理などの機能を提供します。

### バックエンドについて

このフロントエンドは、[smart-stay-platform](https://github.com/karimiku/smart-stay-platform)（バックエンド）と連携して動作します。バックエンドは以下の技術スタックで構築されています：

- **Go (Golang)**: マイクロサービス実装
- **gRPC (Protobuf)**: サービス間通信
- **Google Cloud Pub/Sub**: イベント駆動型アーキテクチャ
- **Supabase**: データベース
- **Docker & Docker Compose**: コンテナ化

バックエンドはマイクロサービスアーキテクチャと BFF（Backend For Frontend）パターンを採用し、以下のサービスで構成されています：

- **api-gateway**: REST API エンドポイント（BFF）
- **auth-service**: 認証・認可サービス
- **reservation-service**: 予約管理サービス
- **key-service**: デジタルキー管理サービス

## 📁 プロジェクト構造

```
smart-stay-platform-frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホームページ
│   ├── login/             # ログインページ
│   ├── signup/            # サインアップページ
│   ├── dashboard/         # ゲストダッシュボード
│   ├── owner/             # オーナーダッシュボード
│   ├── villa/[id]/        # ヴィラ詳細ページ
│   ├── checkout/          # チェックアウトページ
│   └── key/               # デジタルキー表示ページ
├── components/            # Reactコンポーネント
│   ├── ui/                # 再利用可能なUIコンポーネント
│   ├── LandingPage.tsx    # ランディングページ
│   ├── LoginPage.tsx      # ログインページ
│   ├── SignupPage.tsx     # サインアップページ
│   └── ...
├── lib/                   # ユーティリティとAPIクライアント
│   ├── api.ts             # API呼び出し関数
│   ├── auth.ts            # 認証関連ユーティリティ
│   └── data.ts            # データ取得関数
├── types/                 # TypeScript型定義
└── public/                # 静的ファイル
```

## 🎯 主な機能

**Under Development** - 現在開発中です。

## 📝 ライセンス

このプロジェクトはプライベートプロジェクトです。
