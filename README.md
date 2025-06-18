# Experiments / Routines

## Install and Run

```bash
npm install
npm run dev
```

## Goal

The goal of the project is to prove the concept of a routine decoration approach
in TypeScript, that provides a way to replace traditional Express-like middlewares
with a type-safe and structured way of handling HTTP requests and responses.

So, the following pseudo-code:

```typescript
app.use(express.json());

app.use((req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  req.token = token;
  next();
});

app.use((req, res, next) => {
  req.userService = userService;
  req.greetingsService = greetingsService;
  next();
});

app.use((req, res, next) => {
  const token = req.token;
  const user = token ? req.userService.authenticate(token) : null;
  req.user = user;
  next();
});

app.post('/greetings', (req, res) => {
  const { name } = req.body as any;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }

  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const greeting = greetingsService.great(name, req.user);

  res.status(200).json({
    success: true,
    data: {
      greeting,
      from: req.user.name,
    },
  });
});

app.use((error, req, res, next) => {
  console.error('Internal Server Error:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});
```

With the following code:

- *jsonApiRoutine.ts*

  ```typescript
  export const jsonApiRoutine = Routine.of(jsonRoutine)
    .with(errorHandler(internalServerError))
    .with(
      context(({ headers }, ctx) => ({
        ...ctx,
        token:
          readHeader(headers, 'authorization')
            ?.replace(/^Bearer\s+/i, '') ||
          null,
      })),
    )
    .with(context((_, ctx) => ({ ...ctx, userService, greetingsService })))
    .with(
      authenticateWithToken(
        (_: ParsedRequest, { token }) => token,
        (token, { userService }) => userService.authenticate(token),
      ),
    );
  ```

- *postGreetings.ts*

  ```typescript
  const GreetingsInputDTO = toValidator(
    struct({
      body: struct({ name: string }),
    }),
  );

  const GreetingsOutputDTO = toValidator(
    struct({
      status: value(200),
      headers: GenericHeadersDTO,
      body: struct({
        success: value(true),
        data: struct({ greeting: string, from: string }),
      }),
    }),
  );

  export const postGreetings = jsonApiRoutine
    .with(authorizeIf(scopeGranted('greetings:call')))
    .with(input(GreetingsInputDTO, inputValidationError))
    .with(output(GreetingsOutputDTO, outputValidationError('postGreetings')))
    .impl(({ body }, { user, greetingsService }) => {
      const { name } = body;
      return json(200, {
        success: true as const,
        data: {
          greeting: greetingsService.great(name, user),
          from: user.name,
        },
      });
    });

  export type PostGreetingsInput = InputOf<typeof postGreetings>;
  export type PostGreetingsOutput = OutputOf<typeof postGreetings>;
  ```

- *index.ts*

  ```typescript
  app.post('/greetings', postGreetings);
  ```
