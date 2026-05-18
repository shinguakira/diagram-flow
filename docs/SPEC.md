# ダイアグラム・フローエディタ 要件仕様書・アーキテクチャ

## 1. 要件定義（Requirements）

### 1.1 プロダクト概要

ブラウザ上で動作するダイアグラム／フローエディタ。ユーザーはノード（箱）とエッジ（線）を操作し、構造化された図を作成・編集・保存できる。

### 1.2 対象ユーザー

エンジニア / 非エンジニア問わず
業務フロー・設計図・思考整理を行いたいユーザー
初期は個人利用・ローカル保存を想定

### 1.3 スコープ（やること / やらないこと）

#### やること（MVP）

- ノードの作成 / 移動 / 削除
- ノード同士をエッジで接続
- ノードの基本属性編集（ラベル、種類など）
- 状態を JSON として保持
- Undo / Redo
- ローカル保存（LocalStorage or IndexedDB）

#### やらないこと（初期）

- ユーザー認証
- マルチユーザー同時編集
- サーバー永続化
- 高度なレイアウト自動化

### 1.4 非機能要件

- 操作は即時反映（楽観的UI）
- マウス操作中心、将来ショートカット拡張可能
- 60fps を目標（Canvas / SVG 描画）
- UI / 状態 / ドメインロジックを分離
- Copilot が理解しやすい責務単位のファイル構成
- ノードタイプ追加が容易
- 将来的なサーバー同期を想定した状態設計

## 2. 全体アーキテクチャ設計

### 2.1 技術スタック（確定）

| 領域           | 技術                         |
| -------------- | ---------------------------- |
| フレームワーク | React + Vite                 |
| ルーティング   | TanStack Router              |
| 状態管理       | TanStack Store / React state |
| UI             | shadcn/ui + Tailwind         |
| 描画           | SVG or Canvas（抽象化）      |
| 型             | TypeScript                   |
| ビルド         | Vite（rolldownは将来検討）   |

### 2.2 レイヤード構成

src/
├─ app/ # ルーティング・画面構成
├─ features/ # 機能単位（Copilot向き）
├─ domain/ # 純粋なビジネスロジック
├─ store/ # 状態管理
├─ components/ # 汎用UI（shadcnラップ）
├─ lib/ # ユーティリティ

## 3. ドメイン設計（Domain）

### 3.1 中核エンティティ

- Diagram
- Node
- Edge

### 3.2 ドメインルール

- ノードIDは一意
- エッジは存在するノード間のみ作成可能
- ノード削除時、関連エッジも削除
- Undo/Redo は操作単位（Command）で管理
- ここは React を一切 import しない

## 4. 状態管理設計

### 4.1 状態の分類

| 種類     | 内容           | 管理方法    |
| -------- | -------------- | ----------- |
| 永続状態 | ノード・エッジ | Store       |
| UI状態   | 選択中ノード   | React state |
| 一時操作 | ドラッグ中     | local state |

### 4.2 Store構造（例）

DiagramStore {
diagram: Diagram
history: {
past: Diagram[]
future: Diagram[]
}
}

- 更新は action 経由のみ
- UI から直接書き換えない

## 5. UI / Feature設計

### 5.1 Feature単位

features/
├─ diagram/
│ ├─ DiagramCanvas.tsx
│ ├─ useDiagram.ts
│ ├─ diagram.actions.ts
│ └─ diagram.selectors.ts

### 5.2 shadcn の役割

- Dialog（ノード編集）
- Button / Dropdown（ツールバー）
- Card（ノードUI）
- shadcn は見た目だけ。ロジックは features/domain に閉じ込める

## 6. ルーティング設計（TanStack Router）

/
├─ /editor # メインエディタ
└─ /settings # 将来用

- editor は 1画面アプリ
- URL で状態を持たない（初期）

## 7. GitHub Copilot 前提のタスク設計

### 7.1 タスク粒度

- 1タスク = 1〜2ファイル
- ドメイン（Node/Edge/Diagram型や操作関数）はReact非依存で実装
- 状態管理はStore経由、UI状態はReact state
- shadcn/uiはUI部品のみでロジックはfeatures/domainに閉じ込め

### 7.2 推奨タスク分割

- Domain: Node / Edge / Diagram 型定義、操作関数
- Store: DiagramStore 作成、Undo/Redo 実装
- Canvas: ノード描画、ドラッグ移動
- UI: ノード編集ダイアログ、ツールバー

## 8. 将来拡張を見据えた判断

- サーバー同期 → domain / store 再利用可
- マルチユーザー → state差分をイベント化
- rolldown → Vite 置換のみ、設計影響なし

## まとめ（設計思想）

- UIは薄く、ドメインは厚く
- Copilotは部品製造機として使う
- フレームワーク依存は最外周に隔離
