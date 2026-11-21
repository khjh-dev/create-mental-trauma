// Functional organ controls from the newly installed Pipe Organs mod.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['pipeorgans:brass_reed', 'overgeared:iron_plate']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] new_mod_progression.js: missing ' + __missing.join(', ')); return }
  const I = id => ({ item: id })
  const R = (id, count = 1) => ({ id, count })
  const shaped = (name, pattern, key, count = 1) => {
    const output = 'pipeorgans:' + name
    event.remove({ output })
    event.custom({ type: 'minecraft:crafting_shaped', category: 'misc',
      pattern, key, result: R(output, count) }).id('kubejs:new_mods/' + name)
  }
  shaped('base', [' C ', 'PIP', ' C '], {
    C: I('overgeared:copper_plate'), P: I('create:fluid_pipe'),
    I: I('minecraft:copper_ingot')
  }, 6)
  shaped('windchest', ['CPC', 'SRS', 'OIO'], {
    C: I('overgeared:copper_plate'), P: I('create:fluid_pipe'),
    S: I('minecraft:spruce_slab'), R: I('minecraft:redstone'),
    O: I('minecraft:oak_planks'), I: I('overgeared:iron_plate')
  }, 6)
  shaped('windchest_master', ['BZB', 'WPR', 'BIB'], {
    B: I('create:brass_sheet'), Z: I('create:zinc_ingot'),
    W: I('pipeorgans:windchest'), P: I('create:precision_mechanism'),
    R: I('minecraft:redstone'), I: I('overgeared:iron_plate')
  })
  shaped('roll_puncher', ['PQP', 'IPI', 'SSS'], {
    P: I('minecraft:spruce_slab'), Q: I('minecraft:writable_book'),
    I: I('overgeared:iron_plate'), S: I('minecraft:smooth_stone')
  })
  shaped('keyboard_relay', [' T ', 'RPI', ' B '], {
    T: I('create:transmitter'), R: I('minecraft:redstone'),
    P: I('create:precision_mechanism'), I: I('overgeared:iron_plate'),
    B: I('create:brass_casing')
  })
  shaped('tracker_bar', [' S ', 'BPB', 'SIS'], {
    S: I('create:shaft'), B: I('create:brass_casing'),
    P: I('create:precision_mechanism'), I: I('overgeared:steel_plate')
  })
  console.info('[new mods] Pipe Organs control progression registered')
})
