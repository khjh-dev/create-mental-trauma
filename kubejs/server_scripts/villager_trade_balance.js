// Remove finished equipment from a villager's actual offer list on interaction.
// This also catches offers added by structures or other mods after trade setup.
const TradeVillager = Java.loadClass('net.minecraft.world.entity.npc.Villager')
const TradeItems = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')

NativeEvents.onEvent(
  'net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract',
  event => {
    if (event.getLevel().isClientSide()) return
    const villager = event.getTarget()
    if (!(villager instanceof TradeVillager)) return
    const offers = villager.getOffers()
    for (let index = offers.size() - 1; index >= 0; index--) {
      const offer = offers.get(index)
      const id = String(TradeItems.ITEM.getKey(offer.getResult().getItem()))
      const gear = /_(helmet|chestplate|leggings|boots|sword|axe|pickaxe|shovel|hoe|bow|crossbow|shield|mace|trident|horse_armor)$/.test(id)
      const direct = /^(minecraft:(bow|crossbow|shield|mace|trident|elytra)|create:potato_cannon|irons_artifice:(flintlock|blunderbuss|musket|arquebus|six_shooter|blackpowder_revolver|clockwork_rifle))$/.test(id)
      if (gear || direct) offers.remove(offer)
    }
  }
)
