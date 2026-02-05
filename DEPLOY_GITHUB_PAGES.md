# Deploy para GitHub Pages

Opções para publicar este site no GitHub Pages:

1) Usando `gh-pages` (script já adicionado):

- Instale dependências:

```
npm install
```

- Gerar build e publicar (o `predeploy` roda automaticamente antes do `deploy`):

```
npm run deploy
```

Isso publicará a pasta `docs/` no branch `gh-pages`.

2) Ou publicar usando a pasta `docs/` no branch `main` (sem usar `gh-pages`):

- Rode:

```
npm run build
```

- No GitHub, vá em _Settings > Pages_ e escolha `main` / `docs` como source.

Observações:
- O `base` está configurado como `/Culinare/` em `vite.config.ts` para que os assets usem o caminho correto.
- Se preferir publicar em um domínio customizado, coloque o arquivo `CNAME` em `docs/` antes do deploy.
