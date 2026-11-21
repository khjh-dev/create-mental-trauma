// Restore the single world whose border was narrowed by the previous pack
// revision. The gateway mod searches for partner portals beyond that border.
NativeEvents.onEvent('net.neoforged.neoforge.event.server.ServerStartedEvent', event => {
  const border = event.getServer().overworld().getWorldBorder()
  if (Math.abs(border.getSize() - 10000) > 0.1) return
  if (Math.abs(border.getCenterX() + 15.5) > 0.1 ||
      Math.abs(border.getCenterZ() + 15.5) > 0.1) return
  border.setCenter(0, 0)
  border.setSize(59999968)
  console.info('[gateway compatibility] restored default border in affected world')
})
