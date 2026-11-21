// The Last Adventure Before the War: equipment progression.
// All IDs and recipe shapes below target the installed 1.21.1 NeoForge mods.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['overgeared:iron_plate']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] gear_progression.js: missing ' + __missing.join(', ')); return }
  const item = id => ({ item: id })
  const tag = id => ({ tag: id })
  const result = (id, count = 1) => ({ id: id, count: count })
  const add = (name, recipe) => event.custom(recipe).id('kubejs:gear/' + name)
  const removeOutput = id => event.remove({ output: id })

  // Overgeared remains the hand-worked route. A mechanical press provides
  // throughput once a workshop is built; both routes use the same metal.
  event.remove({ id: 'overgeared:steel_plate' })
  add('forged_steel_plate', {
    type: 'overgeared:forging', category: 'misc', hammering: 5,
    has_quality: false, needs_minigame: false,
    pattern: ['#'], key: { '#': tag('c:ingots/steel') },
    result: result('overgeared:steel_plate'), show_notification: true
  })
  ;[
    ['iron', item('minecraft:iron_ingot'), 'overgeared:iron_plate'],
    ['copper', item('minecraft:copper_ingot'), 'overgeared:copper_plate'],
    ['steel', tag('c:ingots/steel'), 'overgeared:steel_plate']
  ].forEach(([metal, input, output]) => add('pressed_' + metal + '_plate', {
    type: 'create:pressing', ingredients: [input], results: [result(output)]
  }))

  // The armor shell is still forged at an Overgeared anvil. Sturdy sheets
  // act as the liner and brass sheets as fittings.
  const armor = [
    ['helmet', ['PBP', 'PSP'], 5],
    ['chestplate', ['P P', 'PSP', 'PBP'], 5],
    ['leggings', ['PBP', 'PSP', 'P P'], 5],
    ['boots', ['P P', 'PSP', ' B '], 5]
  ]
  armor.forEach(([piece, pattern, hammering]) => {
    event.remove({ id: 'overgeared:steel_' + piece })
    add('forged_steel_' + piece, {
      type: 'overgeared:forging', category: 'ARMORS', hammering: hammering,
      has_polishing: false, need_quenching: false,
      pattern: pattern,
      key: {
        P: item('overgeared:steel_plate'),
        S: item('create:sturdy_sheet'),
        B: item('create:brass_sheet')
      },
      result: result('overgeared:steel_' + piece), show_notification: false
    })
  })

  // Reinforced tool heads consume hot steel and a pressed steel backing.
  const heads = [
    ['axe_head', ['HH', 'HP'], 'axe'],
    ['pickaxe_head', ['HHH', ' P '], 'pickaxe'],
    ['shovel_head', ['H', 'P'], 'shovel'],
    ['hoe_head', ['HH', ' P'], 'hoe'],
    ['sword_blade', ['H', 'H', 'P'], 'sword']
  ]
  heads.forEach(([head, pattern, blueprint]) => {
    removeOutput('overgeared:steel_' + head)
    add('forged_steel_' + head, {
      type: 'overgeared:forging', blueprint: [blueprint],
      category: 'TOOL_HEADS', hammering: 5, pattern: pattern,
      key: { H: item('overgeared:heated_steel_ingot'), P: item('overgeared:steel_plate') },
      result: result('overgeared:steel_' + head), show_notification: false
    })
  })

  // Powder and ammunition have an early hand route and a larger factory batch.
  add('hand_gunpowder', {
    type: 'minecraft:crafting_shapeless', category: 'misc',
    ingredients: [item('minecraft:charcoal'), item('minecraft:flint'), item('minecraft:redstone')],
    result: result('minecraft:gunpowder', 2)
  })
  add('mixed_gunpowder', {
    type: 'create:mixing', ingredients: [
      item('minecraft:charcoal'), item('minecraft:flint'), item('minecraft:redstone')
    ], results: [result('minecraft:gunpowder', 4)]
  })
  removeOutput('irons_artifice:blackpowder')
  add('hand_blackpowder', {
    type: 'minecraft:crafting_shapeless', category: 'misc',
    ingredients: [item('minecraft:gunpowder'), item('minecraft:charcoal')],
    result: result('irons_artifice:blackpowder', 4)
  })
  add('mixed_blackpowder', {
    type: 'create:mixing', ingredients: [
      item('minecraft:gunpowder'), item('minecraft:charcoal')
    ], results: [result('irons_artifice:blackpowder', 8)]
  })
  removeOutput('irons_artifice:bullet')
  add('hand_bullets', {
    type: 'minecraft:crafting_shapeless', category: 'misc',
    ingredients: [
      item('minecraft:iron_nugget'), item('minecraft:copper_ingot'),
      item('irons_artifice:blackpowder')
    ], result: result('irons_artifice:bullet', 8)
  })
  add('compacted_bullets', {
    type: 'create:compacting', ingredients: [
      item('minecraft:iron_nugget'), item('minecraft:copper_ingot'),
      item('irons_artifice:blackpowder')
    ], results: [result('irons_artifice:bullet', 16)]
  })

  // Mechanical components are workshop milestones. The 5x5 recipes require
  // Mechanical Crafters, then feed weapon and modifier assembly.
  const mechanical = (name, output, pattern, key) => {
    removeOutput(output)
    add(name, { type: 'create:mechanical_crafting', accept_mirrored: false,
      category: 'misc', pattern: pattern, key: key,
      result: result(output), show_notification: true })
  }
  mechanical('simple_mechanisms', 'irons_artifice:simple_mechanical_components',
    [' C C ', 'IPIPI', 'CPBPC', 'IPIPI', ' C C '], {
      C: item('create:cogwheel'), I: item('overgeared:iron_plate'),
      P: item('overgeared:copper_plate'), B: item('irons_artifice:blackpowder')
    })
  mechanical('mechanisms', 'irons_artifice:mechanical_components',
    [' SLS ', 'PIGIP', 'LIMIL', 'PIGIP', ' SLS '], {
      S: item('overgeared:steel_plate'), L: item('minecraft:chain'),
      P: item('create:precision_mechanism'), I: item('overgeared:iron_plate'),
      G: item('create:large_cogwheel'), M: item('irons_artifice:simple_mechanical_components')
    })
  mechanical('clockwork_mechanisms', 'irons_artifice:clockwork_components',
    [' GCG ', 'PBRBP', 'GMRMG', 'PBRBP', ' GCG '], {
      G: item('create:golden_sheet'), C: item('minecraft:clock'),
      P: item('create:precision_mechanism'), B: item('create:brass_sheet'),
      R: item('minecraft:redstone'), M: item('irons_artifice:mechanical_components')
    })

  // Gun barrels are represented by forged steel or iron plates; the rest
  // of each firearm is fitted by Mechanical Crafters.
  const guns = [
    ['flintlock', 'overgeared:iron_plate', 'irons_artifice:simple_mechanical_components', 'minecraft:flint_and_steel',
      ['MPF', 'CMM', 'LW ']],
    ['blunderbuss', 'overgeared:iron_plate', 'irons_artifice:simple_mechanical_components', 'minecraft:hopper',
      ['FPM', 'MMC', ' WL']],
    ['musket', 'overgeared:steel_plate', 'irons_artifice:simple_mechanical_components', 'minecraft:flint_and_steel',
      ['MPF', 'CMM', 'LW ']],
    ['arquebus', 'overgeared:steel_plate', 'irons_artifice:mechanical_components', 'minecraft:repeater',
      ['MPF', 'CMM', 'LW ']],
    ['six_shooter', 'overgeared:steel_plate', 'irons_artifice:mechanical_components', 'minecraft:hopper',
      ['MPF', 'CMM', 'LW ']],
    ['blackpowder_revolver', 'overgeared:steel_plate', 'irons_artifice:mechanical_components', 'minecraft:clock',
      ['MPF', 'CMM', 'LW ']],
    ['clockwork_rifle', 'overgeared:steel_plate', 'irons_artifice:clockwork_components', 'minecraft:netherite_ingot',
      ['MPF', 'CMM', 'LW ']]
  ]
  guns.forEach(([gun, plate, mechanism, fitting, pattern]) => {
    mechanical('gun_' + gun, 'irons_artifice:' + gun,
      pattern, {
        P: item(plate), F: item(fitting), M: item(mechanism),
        C: item('create:precision_mechanism'), L: tag('minecraft:planks'),
        W: item('create:brass_sheet')
      })
  })

  // Each modifier keeps its original thematic reagent. The shared frame
  // makes the upgrade chain expensive and repeatable in a factory.
  const modifiers = [
    ['antigravity_powder', 'minecraft:ender_pearl', 'simple'],
    ['bayonet_attachment', 'minecraft:iron_sword', 'simple'],
    ['blackpowder_charge', 'minecraft:string', 'simple'],
    ['bloodletting_tip', 'minecraft:ghast_tear', 'mechanical'],
    ['breaching_shell', 'minecraft:flint', 'simple'],
    ['buffer_spring', 'create:large_cogwheel', 'simple'],
    ['chain_shot', 'minecraft:chain', 'simple'],
    ['enchanted_bullet', 'minecraft:lapis_lazuli', 'mechanical'],
    ['frozen_jacket', 'minecraft:blue_ice', 'mechanical'],
    ['gas_vent', 'minecraft:hopper', 'simple'],
    ['gun_oil', 'minecraft:honey_bottle', 'simple'],
    ['hair_trigger', 'minecraft:tripwire_hook', 'simple'],
    ['hook_shot', 'minecraft:chain', 'mechanical'],
    ['incendiary_tip', 'minecraft:blaze_powder', 'mechanical'],
    ['lead_core', 'minecraft:deepslate_bricks', 'simple'],
    ['mechanical_accelerator', 'create:precision_mechanism', 'mechanical'],
    ['mechanical_repeater', 'minecraft:repeater', 'clockwork'],
    ['overcharged_powder', 'minecraft:blaze_powder', 'clockwork'],
    ['scattershot', 'irons_artifice:bullet', 'simple'],
    ['scope_attachment', 'minecraft:spyglass', 'mechanical'],
    ['seeking_powder', 'minecraft:amethyst_cluster', 'mechanical'],
    ['singularity_charge', 'minecraft:ender_eye', 'clockwork'],
    ['spiral_tip', 'minecraft:nautilus_shell', 'mechanical'],
    ['steel_core', 'overgeared:steel_plate', 'mechanical'],
    ['suppressor_attachment', 'minecraft:white_wool', 'clockwork'],
    ['trick_bullet', 'minecraft:gold_block', 'clockwork'],
    ['venom_capsule', 'minecraft:spider_eye', 'simple'],
    ['voltaic_core', 'minecraft:lightning_rod', 'clockwork'],
    ['wind_chamber', 'minecraft:wind_charge', 'clockwork']
  ]
  const core = {
    simple: 'irons_artifice:simple_mechanical_components',
    mechanical: 'irons_artifice:mechanical_components',
    clockwork: 'irons_artifice:clockwork_components'
  }
  modifiers.forEach(([name, theme, tier]) => {
    mechanical('modifier_' + name, 'irons_artifice:' + name + '_modifier',
      ['  P  ', ' ITI ', 'BXCXB', ' ITI ', '  P  '], {
        P: item('overgeared:steel_plate'), I: item('overgeared:iron_plate'),
        T: item(theme), B: item('create:brass_sheet'),
        X: item('irons_artifice:blackpowder'), C: item(core[tier])
      })
  })
  console.info('[gear] Overgeared + Create equipment progression registered')
})
