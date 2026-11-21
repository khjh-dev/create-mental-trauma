// A complete Blaze Burner can be assembled with overworld materials.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['overgeared:iron_plate']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] early_blaze_burner.js: missing ' + __missing.join(', ')); return }
  const I = id => ({ item: id })
  const R = id => ({ id, count: 1 })
  event.remove({ output: 'create:empty_blaze_burner' })
  event.custom({ type: 'minecraft:crafting_shaped', category: 'misc',
    pattern: [' I ', 'ICI', ' I '], key: {
      I: I('overgeared:iron_plate'), C: I('create:andesite_casing')
    }, result: R('create:empty_blaze_burner')
  }).id('kubejs:early_create/empty_blaze_burner')
  event.remove({ output: 'create:blaze_burner' })
  event.custom({ type: 'minecraft:crafting_shaped', category: 'misc',
    pattern: [' L ', 'CBE', ' I '], key: {
      L: I('minecraft:lava_bucket'), C: I('minecraft:coal_block'),
      B: I('create:empty_blaze_burner'), E: I('minecraft:campfire'),
      I: I('overgeared:iron_plate')
    }, result: R('create:blaze_burner')
  }).id('kubejs:early_create/blaze_burner')
  console.info('[early create] Blaze Burner available before the Nether')
})
