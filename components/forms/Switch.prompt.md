Toggle switch for on/off preferences (notifications, filters).

```jsx
<Switch label="Receber novidades por e-mail" checked={v} onChange={e=>setV(e.target.checked)} />
```

The native checkbox behind the track is visually hidden but still focusable and announced
(`role="switch"`); clicking the label toggles it and `:focus-visible` draws the ring on the track.
Always pass `label` — an unlabelled switch has nothing to announce.
