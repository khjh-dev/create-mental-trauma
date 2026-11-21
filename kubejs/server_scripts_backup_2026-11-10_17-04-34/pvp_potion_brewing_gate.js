// Keep ordinary brewing intact. Changes that would create a combat potion
// are handled by Create mixing instead of the Brewing Stand.
const BrewingServers = Java.loadClass('net.neoforged.neoforge.server.ServerLifecycleHooks')
const BrewingComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
const BrewingRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const combatPotion = /^minecraft:(?:(?:long|strong)_)?(?:strength|swiftness|invisibility|regeneration|healing|harming|poison|weakness|slowness|fire_resistance|leaping|turtle_master|slow_falling|wind_charged|weaving|oozing|infested)$/

function brewingPotionId(stack) {
  if (stack.isEmpty()) return ''
  const contents = stack.get(BrewingComponents.POTION_CONTENTS)
  if (!contents) return ''
  const potion = contents.potion()
  if (potion.isEmpty()) return ''
  return String(BrewingRegistries.POTION.getKey(potion.get().value()))
}

NativeEvents.onEvent('net.neoforged.neoforge.event.brewing.PotionBrewEvent$Pre', event => {
  const server = BrewingServers.getCurrentServer()
  if (!server || event.getLength() < 4) return
  const reagent = event.getItem(3)
  if (reagent.isEmpty()) return
  const recipes = server.potionBrewing()
  for (let slot = 0; slot < 3; slot++) {
    const input = event.getItem(slot)
    if (input.isEmpty()) continue
    const result = recipes.mix(reagent, input)
    const before = brewingPotionId(input)
    const after = brewingPotionId(result)
    if (after !== before && combatPotion.test(after)) {
      event.setCanceled(true)
      return
    }
  }
})
