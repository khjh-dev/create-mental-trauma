// Additional equipment and bootstrap recipes for The Last Adventure.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['overgeared:iron_plate', 'fantasy_armor:moon_crystal']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] equipment_expansion.js: missing ' + __missing.join(', ')); return }
  const I = id => ({ item: id })
  const T = id => ({ tag: id })
  const R = (id, count = 1) => ({ id, count })
  const add = (id, recipe) => event.custom(recipe).id('kubejs:extended/' + id)
  const replace = (id, recipeName, recipe) => {
    event.remove({ output: id })
    add(recipeName, recipe)
  }
  const shaped = (name, output, pattern, key, count = 1) => replace(output, name, {
    type: 'minecraft:crafting_shaped', category: 'misc', pattern, key,
    result: R(output, count)
  })
  const smith = (name, output, template, base, addition) => replace(output, name, {
    type: 'minecraft:smithing_transform', template: I(template), base: I(base),
    addition: I(addition), result: R(output)
  })

  // Common iron and copper plate items come from Overgeared. Both the hand
  // forge and the Create press in gear_progression.js remain valid routes.
  event.replaceInput({}, 'create:iron_sheet', 'overgeared:iron_plate')
  event.replaceInput({}, 'create:copper_sheet', 'overgeared:copper_plate')
  event.remove({ output: 'create:iron_sheet' })
  event.remove({ output: 'create:copper_sheet' })

  // Leather, copper, iron, gold, and steel armor now form a longer progression.
  const armorPatterns = {
    helmet: ['PPP', 'P P'],
    chestplate: ['P P', 'PPP', 'PPP'],
    leggings: ['PPP', 'P P', 'P P'],
    boots: ['P P', 'P P']
  }
  for (const piece of Object.keys(armorPatterns)) {
    shaped('tanned_' + piece, 'minecraft:leather_' + piece,
      armorPatterns[piece], { P: I('scout:tanned_leather') })
  }
  const forgedArmor = (metal, piece, output, pattern, key) => {
    event.remove({ output })
    add('forged_' + metal + '_' + piece, {
      type: 'overgeared:forging', category: 'ARMORS', hammering: 5,
      has_polishing: false, need_quenching: false, pattern, key,
      result: R(output), show_notification: false
    })
  }
  const trimmed = {
    helmet: ['PPP', 'L L'],
    chestplate: ['P P', 'PLP', 'PPP'],
    leggings: ['PPP', 'PLP', 'P P'],
    boots: ['P P', 'L L']
  }
  for (const piece of Object.keys(trimmed)) {
    forgedArmor('copper', piece, 'overgeared:copper_' + piece, trimmed[piece], {
      P: I('overgeared:copper_plate'), L: I('scout:tanned_leather')
    })
    forgedArmor('iron', piece, 'minecraft:iron_' + piece, trimmed[piece], {
      P: I('overgeared:iron_plate'), L: I('scout:tanned_leather')
    })
    forgedArmor('gold', piece, 'minecraft:golden_' + piece, trimmed[piece], {
      P: I('minecraft:gold_ingot'), L: I('overgeared:iron_plate')
    })
  }

  // Hand weapons use a visible blade-and-grip silhouette at the bench.
  ;[
    ['copper', 'overgeared:copper_sword', 'overgeared:copper_sword_blade'],
    ['iron', 'minecraft:iron_sword', 'overgeared:iron_sword_blade'],
    ['gold', 'minecraft:golden_sword', 'overgeared:golden_sword_blade'],
    ['steel', 'overgeared:steel_sword', 'overgeared:steel_sword_blade']
  ].forEach(([metal, sword, blade]) => shaped('sword_' + metal, sword,
    [' B ', ' B ', ' S '], { B: I(blade), S: I('minecraft:stick') }))

  // Diamond still upgrades forged steel. Netherite requires Overgeared's
  // nether alloy furnace and cooling stage before smithing.
  for (const piece of Object.keys(armorPatterns)) {
    smith('diamond_' + piece, 'minecraft:diamond_' + piece,
      'overgeared:diamond_upgrade_smithing_template',
      'overgeared:steel_' + piece, 'minecraft:diamond_block')
    smith('netherite_' + piece, 'minecraft:netherite_' + piece,
      'minecraft:netherite_upgrade_smithing_template',
      'minecraft:diamond_' + piece, 'overgeared:netherite_alloy')
  }
  for (const tool of ['axe', 'pickaxe', 'shovel', 'hoe', 'sword']) {
    smith('diamond_' + tool, 'minecraft:diamond_' + tool,
      'overgeared:diamond_upgrade_smithing_template',
      'overgeared:steel_' + tool, 'minecraft:diamond_block')
    smith('netherite_' + tool, 'minecraft:netherite_' + tool,
      'minecraft:netherite_upgrade_smithing_template',
      'minecraft:diamond_' + tool, 'overgeared:netherite_alloy')
  }
  shaped('moon_crystal', 'fantasy_armor:moon_crystal', ['PSP', 'AMA', 'PSP'], {
    P: I('overgeared:steel_plate'), S: I('minecraft:glow_ink_sac'),
    A: I('minecraft:amethyst_shard'), M: I('overgeared:netherite_alloy')
  })

  // Scout: each bag builds on earlier leatherwork. Upgrades keep their
  // smithing transform so contents/components are not turned into loose loot.
  shaped('scout_pouch', 'scout:pouch', ['SLS', 'LPL', 'SIS'], {
    S: I('minecraft:string'), L: I('scout:tanned_leather'),
    P: I('overgeared:copper_plate'), I: I('overgeared:iron_plate')
  })
  shaped('scout_satchel', 'scout:satchel', ['SLS', 'LPL', 'SIS'], {
    S: I('scout:satchel_strap'), L: I('scout:tanned_leather'),
    P: I('scout:pouch'), I: I('overgeared:iron_plate')
  })
  smith('scout_upgraded_pouch', 'scout:upgraded_pouch',
    'overgeared:diamond_upgrade_smithing_template', 'scout:pouch', 'minecraft:diamond_block')
  smith('scout_upgraded_satchel', 'scout:upgraded_satchel',
    'overgeared:diamond_upgrade_smithing_template', 'scout:satchel', 'minecraft:diamond_block')

  // Create equipment: all shared metal plate costs use Overgeared items.
  shaped('copper_backtank', 'create:copper_backtank', ['CPC', 'CTC', 'CIC'], {
    C: I('overgeared:copper_plate'), P: I('create:fluid_pipe'),
    T: I('create:fluid_tank'), I: I('overgeared:iron_plate')
  })
  shaped('copper_diving_helmet', 'create:copper_diving_helmet', ['CCC', 'CGC', 'CLC'], {
    C: I('overgeared:copper_plate'), G: I('minecraft:glass_pane'),
    L: I('scout:tanned_leather')
  })
  shaped('copper_diving_boots', 'create:copper_diving_boots', ['C C', 'L L', 'I I'], {
    C: I('overgeared:copper_plate'), L: I('scout:tanned_leather'),
    I: I('overgeared:iron_plate')
  })
  smith('netherite_diving_helmet', 'create:netherite_diving_helmet',
    'minecraft:netherite_upgrade_smithing_template', 'create:copper_diving_helmet', 'overgeared:netherite_alloy')
  smith('netherite_diving_boots', 'create:netherite_diving_boots',
    'minecraft:netherite_upgrade_smithing_template', 'create:copper_diving_boots', 'overgeared:netherite_alloy')
  smith('netherite_backtank', 'create:netherite_backtank',
    'minecraft:netherite_upgrade_smithing_template', 'create:copper_backtank', 'overgeared:netherite_alloy')

  // Early Create machines can be made after manual forging. Pressing then
  // scales plate production, and brass/precision machines form the next tier.
  shaped('mechanical_press', 'create:mechanical_press', [' I ', ' B ', ' C '], {
    I: I('overgeared:iron_plate'), B: I('minecraft:iron_block'),
    C: I('create:andesite_casing')
  })
  shaped('millstone', 'create:millstone', [' S ', 'ACA', ' G '], {
    S: I('minecraft:stone'), A: I('create:andesite_alloy'),
    C: I('create:andesite_casing'), G: I('create:cogwheel')
  })
  shaped('water_wheel', 'create:water_wheel', ['PPP', 'PCP', 'PPP'], {
    P: T('minecraft:planks'), C: I('create:large_cogwheel')
  })
  shaped('mechanical_mixer', 'create:mechanical_mixer', [' G ', 'ICI', ' W '], {
    G: I('create:large_cogwheel'), I: I('overgeared:iron_plate'),
    C: I('create:andesite_casing'), W: I('create:whisk')
  })
  shaped('mechanical_drill', 'create:mechanical_drill', [' I ', 'ICI', ' S '], {
    I: I('overgeared:iron_plate'), C: I('create:andesite_casing'),
    S: I('create:shaft')
  })
  shaped('mechanical_saw', 'create:mechanical_saw', ['III', 'ICI', ' S '], {
    I: I('overgeared:iron_plate'), C: I('create:andesite_casing'),
    S: I('create:shaft')
  })
  shaped('mechanical_harvester', 'create:mechanical_harvester', ['III', 'ICI', ' S '], {
    I: I('overgeared:iron_plate'), C: I('create:andesite_casing'),
    S: I('minecraft:iron_hoe')
  })
  shaped('mechanical_plough', 'create:mechanical_plough', ['III', 'ICI', ' S '], {
    I: I('overgeared:iron_plate'), C: I('create:andesite_casing'),
    S: I('minecraft:iron_shovel')
  })
  shaped('mechanical_piston', 'create:mechanical_piston', [' I ', 'PCP', ' S '], {
    I: I('overgeared:iron_plate'), P: I('create:piston_extension_pole'),
    C: I('create:andesite_casing'), S: I('create:shaft')
  })
  shaped('mechanical_bearing', 'create:mechanical_bearing', [' I ', 'PCP', ' S '], {
    I: I('overgeared:iron_plate'), P: I('create:shaft'),
    C: I('create:andesite_casing'), S: I('create:large_cogwheel')
  })
  shaped('windmill_bearing', 'create:windmill_bearing', [' I ', 'PCP', ' S '], {
    I: I('overgeared:iron_plate'), P: T('minecraft:planks'),
    C: I('create:andesite_casing'), S: I('create:shaft')
  })
  shaped('encased_fan', 'create:encased_fan', [' I ', 'IPI', ' C '], {
    I: I('overgeared:iron_plate'), P: I('create:propeller'),
    C: I('create:andesite_casing')
  })
  shaped('deployer', 'create:deployer', [' B ', 'ICI', ' H '], {
    B: I('create:brass_sheet'), I: I('overgeared:iron_plate'),
    C: I('create:andesite_casing'), H: I('create:brass_hand')
  })
  shaped('mechanical_crafter', 'create:mechanical_crafter', [' B ', 'PCP', ' S '], {
    B: I('create:brass_sheet'), P: I('create:precision_mechanism'),
    C: I('create:brass_casing'), S: I('overgeared:steel_plate')
  })
  shaped('steam_engine', 'create:steam_engine', [' P ', 'ICI', ' B '], {
    P: I('create:precision_mechanism'), I: I('overgeared:iron_plate'),
    C: I('create:copper_casing'), B: I('create:brass_sheet')
  })
  shaped('rotation_speed_controller', 'create:rotation_speed_controller', [' B ', 'PCP', ' S '], {
    B: I('create:brass_sheet'), P: I('create:precision_mechanism'),
    C: I('create:brass_casing'), S: I('overgeared:steel_plate')
  })
  shaped('sequenced_gearshift', 'create:sequenced_gearshift', [' B ', 'PCP', ' S '], {
    B: I('create:brass_sheet'), P: I('create:precision_mechanism'),
    C: I('create:gearshift'), S: I('overgeared:steel_plate')
  })
  shaped('elevator_pulley', 'create:elevator_pulley', [' S ', 'PCP', ' R '], {
    S: I('overgeared:steel_plate'), P: I('create:precision_mechanism'),
    C: I('create:rope_pulley'), R: I('create:brass_sheet')
  })
  shaped('mechanical_pump', 'create:mechanical_pump', [' I ', 'PCP', ' S '], {
    I: I('overgeared:iron_plate'), P: I('create:fluid_pipe'),
    C: I('create:andesite_casing'), S: I('create:shaft')
  })
  shaped('mechanical_roller', 'create:mechanical_roller', ['III', 'PCP', ' S '], {
    I: I('overgeared:iron_plate'), P: I('create:precision_mechanism'),
    C: I('create:brass_casing'), S: I('create:shaft')
  })
  shaped('track_station', 'create:track_station', [' B ', 'PCP', ' I '], {
    B: I('create:brass_sheet'), P: I('create:precision_mechanism'),
    C: I('create:railway_casing'), I: I('overgeared:iron_plate')
  })

  // The bundled Aeronautics mod has its own recipes. Airship basics are
  // cheaper than factory/weapon systems, while colors remain cosmetic.
  shaped('aero_propeller_bearing', 'aeronautics:propeller_bearing', [' W ', ' I ', ' C '], {
    W: T('minecraft:wooden_slabs'), I: I('overgeared:iron_plate'),
    C: I('create:andesite_casing')
  })
  shaped('aero_gyro_bearing', 'aeronautics:gyroscopic_propeller_bearing', [' W ', ' P ', ' C '], {
    W: T('minecraft:wooden_slabs'), P: I('create:precision_mechanism'),
    C: I('create:brass_casing')
  })
  shaped('aero_smart_propeller', 'aeronautics:smart_propeller', [' P ', ' G ', ' C '], {
    P: I('create:propeller'), G: I('create:precision_mechanism'),
    C: I('create:brass_casing')
  }, 2)
  shaped('aero_adjustable_burner', 'aeronautics:adjustable_burner', [' I ', ' R ', ' C '], {
    I: I('overgeared:iron_plate'), R: I('minecraft:redstone'),
    C: I('create:blaze_burner')
  })
  shaped('aero_steam_vent', 'aeronautics:steam_vent', [' G ', ' C '], {
    G: I('create:golden_sheet'), C: I('minecraft:copper_ingot')
  })
  shaped('aero_envelope', 'aeronautics:white_envelope', ['WS', 'SW'], {
    W: I('minecraft:white_wool'), S: I('minecraft:stick')
  }, 8)
  console.info('[extended] armor, Scout, core Create, and Aeronautics recipes registered')
})
