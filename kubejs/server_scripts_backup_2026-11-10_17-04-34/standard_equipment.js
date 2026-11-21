// Vanilla equipment now follows knapping, forging, plate, and factory stages.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['overgeared:iron_plate']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] standard_equipment.js: missing ' + __missing.join(', ')); return }
  const I = id => ({ item: id })
  const T = id => ({ tag: id })
  const R = id => ({ id, count: 1 })
  const shaped = (name, output, pattern, key) => {
    event.remove({ output })
    event.custom({ type: 'minecraft:crafting_shaped', category: 'misc',
      pattern, key, result: R(output) }).id('kubejs:standard/' + name)
  }

  // The wood-to-stone bootstrap uses Minecraft's original shapes and tags.
  const vanillaPatterns = [
    ['pickaxe', ['XXX', ' # ', ' # ']],
    ['axe', ['XX', 'X#', ' #']],
    ['shovel', ['X', '#', '#']],
    ['hoe', ['XX', ' #', ' #']],
    ['sword', ['X', 'X', '#']]
  ]
  ;[
    ['wooden', 'minecraft:planks'],
    ['stone', 'minecraft:stone_tool_materials']
  ].forEach(([metal, material]) => vanillaPatterns.forEach(([tool, pattern]) => {
    const output = 'minecraft:' + metal + '_' + tool
    event.remove({ output })
    event.custom({ type: 'minecraft:crafting_shaped', category: 'equipment',
      pattern, key: { X: T(material), '#': I('minecraft:stick') },
      result: R(output) }).id('kubejs:vanilla_bootstrap/' + metal + '_' + tool)
  }))

  ;[
    ['copper', 'overgeared:copper', 'copper'],
    ['iron', 'minecraft:iron', 'iron'],
    ['golden', 'minecraft:golden', 'golden'],
    ['steel', 'overgeared:steel', 'steel']
  ].forEach(([metal, prefix, headMetal]) => {
    ;['axe', 'pickaxe', 'shovel', 'hoe'].forEach(tool => {
      const head = 'overgeared:' + headMetal + '_' + tool + '_head'
      const grip = metal === 'stone' ? 'minecraft:string' :
        metal === 'iron' ? 'overgeared:iron_plate' : 'scout:tanned_leather'
      shaped(metal + '_' + tool, prefix + '_' + tool,
        [' H ', ' G ', ' S '], { H: I(head), G: I(grip), S: I('minecraft:stick') })
    })
  })

  // Utility gear has separate early and forged-metal milestones.
  shaped('shield', 'minecraft:shield', ['LPL', 'LIL', ' L '], {
    L: T('minecraft:planks'), P: I('scout:tanned_leather'),
    I: I('overgeared:iron_plate')
  })
  shaped('bow', 'minecraft:bow', [' SL', 'SCL', ' SL'], {
    S: I('minecraft:stick'), L: I('minecraft:string'),
    C: I('minecraft:leather')
  })
  shaped('crossbow', 'minecraft:crossbow', ['LSL', 'IPI', ' L '], {
    L: I('minecraft:string'), S: I('minecraft:bow'),
    I: I('overgeared:iron_plate'), P: I('minecraft:tripwire_hook')
  })
  shaped('shears', 'minecraft:shears', [' I', 'I '], {
    I: I('overgeared:iron_plate')
  })
  shaped('flint_and_steel', 'minecraft:flint_and_steel', [' F', 'I '], {
    F: I('minecraft:flint'), I: I('overgeared:iron_plate')
  })
  shaped('fishing_rod', 'minecraft:fishing_rod', ['  S', ' SL', 'SCL'], {
    S: I('minecraft:stick'), L: I('minecraft:string'),
    C: I('minecraft:leather')
  })
  shaped('spyglass', 'minecraft:spyglass', [' G ', 'C C', ' P '], {
    G: I('minecraft:amethyst_shard'), C: I('overgeared:copper_plate'),
    P: I('minecraft:glass_pane')
  })
  shaped('brush', 'minecraft:brush', [' F ', ' C ', ' S '], {
    F: I('minecraft:feather'), C: I('overgeared:copper_plate'),
    S: I('minecraft:stick')
  })
  shaped('wolf_armor', 'minecraft:wolf_armor', ['APA', 'ALA', 'A A'], {
    A: I('minecraft:armadillo_scute'), P: I('overgeared:iron_plate'),
    L: I('scout:tanned_leather')
  })
  shaped('leather_horse_armor', 'minecraft:leather_horse_armor',
    ['L L', 'LPL', 'LLL'], {
      L: I('scout:tanned_leather'), P: I('overgeared:iron_plate')
    })
  shaped('iron_horse_armor', 'minecraft:iron_horse_armor',
    ['P P', 'PLP', 'PPP'], {
      P: I('overgeared:iron_plate'), L: I('minecraft:leather_horse_armor')
    })
  shaped('golden_horse_armor', 'minecraft:golden_horse_armor',
    ['G G', 'GLG', 'GGG'], {
      G: I('create:golden_sheet'), L: I('minecraft:iron_horse_armor')
    })
  event.remove({ output: 'minecraft:diamond_horse_armor' })
  event.custom({ type: 'minecraft:smithing_transform',
    template: I('overgeared:diamond_upgrade_smithing_template'),
    base: I('minecraft:iron_horse_armor'),
    addition: I('minecraft:diamond_block'),
    result: R('minecraft:diamond_horse_armor')
  }).id('kubejs:standard/diamond_horse_armor')
  shaped('turtle_helmet', 'minecraft:turtle_helmet', ['SSS', 'SLS'], {
    S: I('minecraft:turtle_scute'), L: I('scout:tanned_leather')
  })

  // The mace needs its trial-chamber core, Nether alloy, factory precision,
  // and five forging actions. This keeps it beyond basic iron and Create.
  event.remove({ output: 'minecraft:mace' })
  event.custom({ type: 'overgeared:forging', category: 'TOOL_HEADS',
    hammering: 5, pattern: ['SHS', 'NEN', 'PBP'], key: {
      S: I('overgeared:steel_plate'), H: I('minecraft:heavy_core'),
      N: I('overgeared:netherite_alloy'), E: I('minecraft:echo_shard'),
      P: I('create:precision_mechanism'), B: I('minecraft:breeze_rod')
    }, result: R('minecraft:mace'), show_notification: true
  }).id('kubejs:standard/forged_mace')
  console.info('[standard] vanilla equipment and mace progression registered')
})
