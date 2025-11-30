# Smart Stay Platform Frontend

Smart Stay Platform のフロントエンドアプリケーションです。Next.js、React、TypeScript を使用して構築されています。

## 🌐 デモ

\*_サイト_: [https://smart-stay-dusky.vercel.app](https://smart-stay-dusky.vercel.app)

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

- **ユーザー認証**: サインアップ、ログイン、ログアウト
- **ヴィラ検索・閲覧**: 利用可能なヴィラの検索と詳細表示
- **予約管理**: 予約の作成、一覧表示、確認
- **デジタルキー管理**: 予約に紐づくデジタルキーの表示と管理
- **ダッシュボード**: ゲストとオーナー向けの専用ダッシュボード
- **チェックアウト**: 予約の決済処理

## ⚙️ 環境変数の設定

このアプリケーションは、バックエンド API の URL を環境変数で設定します。

### ローカル開発環境

プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください：

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 本番環境（デプロイ時）

デプロイ先の環境変数設定で、以下の環境変数を設定してください：

```bash
NEXT_PUBLIC_API_URL=https://api-gateway-967667033470.asia-northeast1.run.app
```

**重要**: 環境変数はコード内に直接記述せず、必ず環境変数として設定してください。

## 🚀 デプロイ

### Vercel へのデプロイ

#### 方法 1: Vercel CLI を使用

```bash
# Vercel CLIをインストール（初回のみ）
npm i -g vercel

# プロジェクトディレクトリに移動
cd smart-stay-platform-frontend

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

#### 方法 2: Vercel CLI で環境変数を設定してデプロイ

```bash
# 環境変数を設定してデプロイ
vercel --prod \
  -e NEXT_PUBLIC_API_URL=https://api-gateway-967667033470.asia-northeast1.run.app
```

#### 方法 3: Vercel ダッシュボードで環境変数を設定

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクトを選択
3. Settings → Environment Variables に移動
4. 以下の環境変数を追加：
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://api-gateway-967667033470.asia-northeast1.run.app`
   - **Environment**: Production, Preview, Development すべてにチェック
5. 保存後、再デプロイ

### ビルドとローカル確認

```bash
# 依存関係のインストール
npm install

# 本番用ビルド
npm run build

# 本番モードでローカル実行
npm start
```

## 📝 ライセンス

このプロジェクトはプライベートプロジェクトです。
