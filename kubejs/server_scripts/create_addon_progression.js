// Progression recipes for functional Create addons; color and decorative
// variants keep their own recipes and inherit these base components.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['overgeared:copper_plate']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] create_addon_progression.js: missing ' + __missing.join(', ')); return }
  const I = id => ({ item: id })
  const T = id => ({ tag: id })
  const R = (id, count = 1) => ({ id, count })
  const shaped = (name, output, pattern, key, count = 1) => {
    if (!__has(output)) { return }
    event.remove({ output })
    event.custom({ type: 'minecraft:crafting_shaped', category: 'misc', pattern, key,
      result: R(output, count) }).id('kubejs:addons/' + name)
  }
  const machine = (name, output, pattern, key, count = 1) => {
    if (!__has(output)) { return }
    event.remove({ output })
    event.custom({ type: 'create:mechanical_crafting', accept_mirrored: false,
      category: 'misc', pattern, key, result: R(output, count),
      show_notification: true }).id('kubejs:addons/' + name)
  }

  // Base Create addons share an iron/copper plate economy while their brass
  // and gold sheets keep Create's distinct material progression.
  shaped('brass_gearbox', 'create_ca:brass_gearbox', [' B ', 'GCG', ' B '], {
    B: I('create:brass_sheet'), G: I('create:large_cogwheel'),
    C: I('create:brass_casing')
  })
  shaped('brass_chain_drive', 'create_ca:brass_chain_drive', [' B ', 'GCG', ' B '], {
    B: I('create:brass_sheet'), G: I('create:chain_conveyor'),
    C: I('create:brass_casing')
  })

  // Ore excavation moves from forged steel drills into precision surveying.
  shaped('ore_drill', 'createoreexcavation:drill', ['SSS', 'SDS', ' P '], {
    S: I('overgeared:steel_plate'), D: I('create:mechanical_drill'),
    P: I('create:precision_mechanism')
  })
  machine('sample_drill', 'createoreexcavation:sample_drill',
    ['  S  ', ' SPS ', 'SPDPS', ' SPS ', '  S  '], {
      S: I('overgeared:steel_plate'), P: I('create:precision_mechanism'),
      D: I('createoreexcavation:drill')
    })
  shaped('diamond_drill', 'createoreexcavation:diamond_drill', ['DDD', 'DSD', ' P '], {
    D: I('minecraft:diamond'), S: I('createoreexcavation:sample_drill'),
    P: I('overgeared:steel_plate')
  })

  // Early gliders remain obtainable before endgame flight gear.
  shaped('wing_mesh', 'createornithopterglider:wing_mesh', ['SWS', 'WCW', 'SWS'], {
    S: I('minecraft:string'), W: I('minecraft:white_wool'),
    C: I('overgeared:copper_plate')
  }, 2)
  shaped('ornithopter', 'createornithopterglider:ornithopterglider', ['W W', 'WGW', 'RCR'], {
    W: I('createornithopterglider:wing_mesh'),
    G: I('create:large_cogwheel'), R: I('createornithopterglider:rope'),
    C: I('create:andesite_casing')
  })

  // Shipbuilding requires steel and precision after basic Create mechanics.
  shaped('boat_engine', 'create_high_seas:boat_engine', [' S ', 'PEP', ' B '], {
    S: I('overgeared:steel_plate'), P: I('create:propeller'),
    E: I('create:steam_engine'), B: I('create:brass_casing')
  })
  shaped('submarine_propeller', 'create_submarine:submarine_propeller', [' P ', 'PSP', ' I '], {
    P: I('create:propeller'), S: I('create:shaft'),
    I: I('overgeared:iron_plate')
  })
  shaped('ballast_tank', 'create_submarine:ballast_tank', ['CSC', 'CTC', 'CPC'], {
    C: I('overgeared:copper_plate'), S: I('create:sturdy_sheet'),
    T: I('create:fluid_tank'), P: I('create:mechanical_pump')
  })
  shaped('sonar', 'create_submarine:sonar', [' A ', 'PCP', ' S '], {
    A: I('minecraft:amethyst_shard'), P: I('create:precision_mechanism'),
    C: I('create:brass_casing'), S: I('overgeared:steel_plate')
  })
  shaped('water_thruster', 'create_submarine:water_thruster', [' C ', 'PMP', ' S '], {
    C: I('overgeared:copper_plate'), P: I('create:propeller'),
    M: I('create:mechanical_pump'), S: I('overgeared:steel_plate')
  })
  shaped('iron_pressurizer', 'create_submarine:iron_pressurizer', [' I ', 'PTP', ' I '], {
    I: I('overgeared:iron_plate'), P: I('create:mechanical_pump'),
    T: I('create:fluid_tank')
  })
  shaped('copper_pressurizer', 'create_submarine:copper_pressurizer', [' C ', 'PTP', ' C '], {
    C: I('overgeared:copper_plate'), P: I('create:mechanical_pump'),
    T: I('create:fluid_tank')
  })

  // Propulsion: a wing and a basic motor precede vector and ion systems.
  shaped('propulsion_wing', 'createpropulsion:wing', ['III', 'AAA', ' S '], {
    I: I('overgeared:iron_plate'), A: I('create:andesite_alloy'),
    S: I('create:sturdy_sheet')
  }, 2)
  shaped('stirling_engine', 'createpropulsion:stirling_engine', [' C ', 'GSG', ' I '], {
    C: I('overgeared:copper_plate'), G: I('create:cogwheel'),
    S: I('create:shaft'), I: I('overgeared:iron_plate')
  })
  shaped('basic_thruster', 'createpropulsion:thruster', [' S ', 'PMP', ' C '], {
    S: I('overgeared:steel_plate'), P: I('create:fluid_pipe'),
    M: I('create:mechanical_pump'), C: I('create:brass_casing')
  })
  shaped('solid_fuel_thruster', 'createpropulsion:solid_fuel_thruster', [' C ', 'STS', ' P '], {
    C: I('overgeared:copper_plate'), S: I('overgeared:steel_plate'),
    T: I('createpropulsion:thruster'), P: I('create:precision_mechanism')
  })
  shaped('ion_thruster', 'createpropulsion:ion_thruster', [' P ', 'STS', ' C '], {
    P: I('create:precision_mechanism'), S: I('create:sturdy_sheet'),
    T: I('createpropulsion:thruster'), C: I('createpropulsion:platinum_sheet')
  })
  shaped('vector_thruster', 'createpropulsion:vector_thruster', [' P ', 'SIS', ' C '], {
    P: I('create:precision_mechanism'), S: I('createpropulsion:platinum_sheet'),
    I: I('createpropulsion:ion_thruster'), C: I('create:brass_casing')
  })

  // Radar/fire control are late factory products, including artillery support.
  shaped('radar_bearing', 'create_radar:radar_bearing', [' B ', 'PSP', ' I '], {
    B: I('create:brass_sheet'), P: I('create:precision_mechanism'),
    S: I('create:shaft'), I: I('overgeared:iron_plate')
  })
  shaped('plane_radar', 'create_radar:plane_radar', [' S ', 'PRP', ' B '], {
    S: I('overgeared:steel_plate'), P: I('create:precision_mechanism'),
    R: I('create_radar:radar_bearing'), B: I('create:brass_casing')
  })
  shaped('fire_controller', 'create_radar:fire_controller', [' P ', 'RCR', ' S '], {
    P: I('create:precision_mechanism'), R: I('create_radar:plane_radar'),
    C: I('create:brass_casing'), S: I('overgeared:steel_plate')
  })
  shaped('guided_fuze', 'create_radar:guided_fuze', [' R ', 'PFP', ' B '], {
    R: I('create_radar:data_link'), P: I('create:precision_mechanism'),
    F: I('createbigcannons:impact_fuze'), B: I('create:brass_sheet')
  })

  // Artillery hardware is assembled from forged plates. Its ammunition
  // remains on its existing manufacturing lines.
  shaped('cannon_mount', 'createbigcannons:cannon_mount', ['SIS', 'PCP', 'SIS'], {
    S: I('overgeared:steel_plate'), I: I('overgeared:iron_plate'),
    P: I('create:precision_mechanism'), C: I('create:andesite_casing')
  })
  shaped('cannon_loader', 'createbigcannons:cannon_loader', [' S ', 'PCP', ' E '], {
    S: I('overgeared:steel_plate'), P: I('create:piston_extension_pole'),
    C: I('create:andesite_casing'), E: I('create:precision_mechanism')
  })
  shaped('cannon_welder', 'createbigcannons:cannon_welder', [' B ', 'SZS', ' P '], {
    B: I('create:brass_sheet'), S: I('overgeared:steel_plate'),
    Z: I('create:blaze_burner'), P: I('create:precision_mechanism')
  })
  shaped('steel_breech', 'createbigcannons:steel_sliding_breechblock', [' S ', 'GPG', ' S '], {
    S: I('overgeared:steel_plate'), G: I('create:cogwheel'),
    P: I('create:precision_mechanism')
  })
  machine('cannon_carriage', 'createbigcannons:cannon_carriage',
    ['W   W', ' PSP ', 'WCCCW', ' W W '], {
      W: I('createbigcannons:pair_of_cannon_wheels'),
      P: I('create:precision_mechanism'), S: I('overgeared:steel_plate'),
      C: T('minecraft:planks')
    })
  console.info('[addons] functional Create-addon progression registered')
})
