# タスクリスト（Copilot向け分割）

---

参照ドキュメント：

- REQUIREMENTS.md（要件定義）
- ARCHITECTURE.md（アーキテクチャ設計）
- SPEC.md（全体仕様まとめ）

---

1. Node型・Edge型・Diagram型の定義（domain/diagramTypes.ts）
   - Node, Edge, Diagram型と基本制約（ID一意性、接続制約）をTypeScriptで定義
   - 参照: ARCHITECTURE.md「3. ドメイン設計」
2. Diagram操作関数の実装（domain/diagramOps.ts）
   - addNode, removeNode, addEdge, removeEdgeなど純粋関数で実装。UI非依存
   - 参照: ARCHITECTURE.md「3.2 ドメインルール」
3. DiagramStoreの作成（store/diagramStore.ts）
   - DiagramとUndo/Redo履歴を管理するストア。状態更新はaction経由のみ
   - 参照: ARCHITECTURE.md「4. 状態管理設計」
4. ルート構成・ルーティング実装（app/）
   - TanStack Routerを使い、/editor, /settingsルートを作成
   - 参照: ARCHITECTURE.md「6. ルーティング設計」
5. DiagramCanvasコンポーネント作成（features/diagram/DiagramCanvas.tsx）
   - SVGまたはCanvasでノード・エッジを描画
   - 参照: ARCHITECTURE.md「5. UI / Feature設計」
6. ノード編集ダイアログUI（features/diagram/NodeDialog.tsx）
   - shadcn/uiのDialogでノード属性編集UIを作成
   - 参照: ARCHITECTURE.md「5.2 shadcn の役割」
7. ツールバーUIの作成（features/diagram/Toolbar.tsx）
   - ノード追加・削除・Undo/Redoなどの操作ボタンUI。shadcn/ui利用
   - 参照: ARCHITECTURE.md「5.2 shadcn の役割」
8. ローカル保存・復元機能（lib/storage.ts）
   - LocalStorageまたはIndexedDBでDiagram状態を保存・復元する関数
   - 参照: REQUIREMENTS.md「1.3 スコープ」
9. Tailwind/shadcn/uiセットアップ確認
   - UI部品が正しく動作するようTailwindとshadcn/uiのセットアップ・動作確認
   - 参照: ARCHITECTURE.md「2.1 技術スタック」
