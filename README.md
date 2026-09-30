Note : - I added a few extra entries in `src/mock/experiences.json` so all the success and failure cases show up on one screen.

## Architecture

mock backend (`fetchExperiences`) -> App -> ExperienceRuntime (one per experience) -> registry -> experience component -> its own mock API

## Registration

Every experience file registers itself at the bottom, like `registerExperience("tarot", "v1", TarotV1)`. The registry is just a Map with keys like `tarot/v1`. `src/experience/index.ts` imports all the experience files so they get registered when the app starts.

## Module / component boundaries

| Module | Owns |
| --- | --- |
| `src/runtime` (registry, ExperienceRuntime, ErrorBoundary) | looking up experiences, lifecycle, showing or hiding failures |
| `src/experience` (one file per experience/version) | its config meaning and defaults, its mock API, its UI, when it's completed |
| `src/api/mockApi.ts` | loading the experience list from the "backend" |

The runtime and experiences only talk through two props: `config` goes down, `onStatusChange` comes back up.

## State and data flow

App fetches the list and renders an ExperienceRuntime for each enabled one. The runtime passes `config` straight to the experience without reading it, so only Tarot knows what `deck` and `maxCards` mean. The experience sends its status back with `onStatusChange`. Every runtime has its own state, so one failing doesn't touch the others.

## Versioning

Version is part of the registry key, so two versions can be registered at the same time. Gemstone v1 and v2 are separate files and the backend picks which one to show. `gemstone v3` isn't registered, so it shows "Unsupported" instead of crashing.

## Failure handling

Lifecycle: initializing -> loading -> ready -> completed / failed

- Tarot with deck `retro`: unknown config, card shows the error
- Gemstone v1: mock API returns 503, card shows the error
- Consultation with `ai_astrologer`: fails, and since it has `"onFailure": "hide"` the card is removed
- Each experience is wrapped in an ErrorBoundary in case it crashes while rendering
- Backend down: set `SIMULATE_BACKEND_DOWN = true` in `mockApi.ts`

## Adding a new experience

1. Create `src/experience/<name>.tsx` with the config type, mock API and component
2. Call `registerExperience("<name>", "v1", Component)`
3. Import it in `src/experience/index.ts`
4. Add it to the backend config

The runtime doesn't change.

## Major trade-offs and decisions

- **Experiences register themselves instead of the runtime listing them.** The runtime never changes when a team adds one; it's a new file plus one import in `index.ts`.
  - Trade-off: an experience's code has to be in the app bundle, so the backend can't turn on one the app doesn't have yet (it shows "Unsupported"). Every experience is also bundled upfront.
  - Improve: adding an experience is JS-only, so it can ship over the air (EAS Update / CodePush) without a store release. With many experiences, lazy load them to keep the bundle small.
- **Each experience owns its config and data loading.** The runtime passes `config` through without reading it, so it stays generic.
  - Trade-off: every experience repeats the same loading pattern, and the registry types config as `any`.
  - Improve: a shared hook for the loading pattern, and runtime validation of each experience's config.
- **One file per version instead of version checks inside one component.** Versions don't affect each other and an old one can be deleted cleanly. New versions are JS-only, so they can ship over the air (EAS Update / CodePush).
  - Trade-off: some duplicate code between versions.
  - Improve: move the shared parts (API calls, small UI pieces) into helpers both versions use.
