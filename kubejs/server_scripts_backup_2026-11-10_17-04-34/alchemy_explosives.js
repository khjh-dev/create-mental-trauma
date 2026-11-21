// Dangerous payloads follow the forged-metal progression.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['overgeared:iron_plate']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] alchemy_explosives.js: missing ' + __missing.join(', ')); return }
  const I = id => ({ item: id })
  const T = id => ({ tag: id })
  const R = (id, count = 1) => ({ id, count })
  const shaped = (name, output, pattern, key, count = 1) => {
    event.remove({ output })
    event.custom({ type: 'minecraft:crafting_shaped', category: 'misc',
      pattern, key, result: R(output, count) }).id('kubejs:danger/' + name)
  }
  // TNT still uses five powder-equivalents, plus a forged shell. The
  // hand-crafted ammunition route in gear_progression.js stays inexpensive.
  shaped('tnt', 'minecraft:tnt', ['GSG', 'SCP', 'GSG'], {
    G: I('minecraft:gunpowder'), S: I('minecraft:sand'),
    C: I('irons_artifice:blackpowder'), P: I('overgeared:iron_plate')
  })
  shaped('tnt_minecart', 'minecraft:tnt_minecart', [' S ', 'TCT', 'IPI'], {
    S: I('overgeared:steel_plate'), T: I('minecraft:tnt'),
    C: I('minecraft:minecart'), I: I('overgeared:iron_plate'),
    P: I('create:precision_mechanism')
  })
  event.remove({ output: 'minecraft:end_crystal' })
  event.custom({ type: 'create:mechanical_crafting', accept_mirrored: false,
    category: 'misc', pattern: [' GGG', 'GGCG', 'GTPG', ' GGG'], key: {
      G: I('minecraft:glass'), C: I('minecraft:ender_eye'),
      T: I('minecraft:ghast_tear'), P: I('overgeared:steel_plate')
    }, result: R('minecraft:end_crystal'), show_notification: true
  }).id('kubejs:danger/end_crystal')
  event.remove({ output: 'minecraft:respawn_anchor' })
  event.custom({ type: 'create:mechanical_crafting', accept_mirrored: false,
    category: 'misc', pattern: ['CCC ', 'GGG ', 'CCC ', ' S  '], key: {
      C: I('minecraft:crying_obsidian'), G: I('minecraft:glowstone'),
      S: I('overgeared:steel_plate')
    }, result: R('minecraft:respawn_anchor'), show_notification: true
  }).id('kubejs:danger/respawn_anchor')
  shaped('fire_charge', 'minecraft:fire_charge', [' B ', 'GCG', ' P '], {
    B: I('minecraft:blaze_powder'), G: I('minecraft:gunpowder'),
    C: I('minecraft:charcoal'), P: I('overgeared:copper_plate')
  }, 3)
  shaped('underwater_mine', 'create_submarine:underwater_mine',
    ['STS', 'TPT', 'STS'], {
      S: I('overgeared:steel_plate'), T: I('minecraft:tnt'),
      P: I('create:precision_mechanism')
    })
  console.info('[danger] explosive devices registered')
})
