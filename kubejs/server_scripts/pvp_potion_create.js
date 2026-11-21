// Combat potions are assembled in a heated Create Mixer. The ingredient
// checks the potion component, so any other bottle cannot substitute for it.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['overgeared:iron_plate']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] pvp_potion_create.js: missing ' + __missing.join(', ')); return }
  const I = id => ({ item: id })
  const potionInput = name => ({
    type: 'neoforge:components', items: 'minecraft:potion', strict: false,
    components: { 'minecraft:potion_contents': { potion: 'minecraft:' + name } }
  })
  const potionOutput = name => ({ id: 'minecraft:potion', count: 1,
    components: { 'minecraft:potion_contents': { potion: 'minecraft:' + name } }
  })
  const mix = (name, from, reagents, heat) => {
    event.custom({ type: 'create:mixing', heat_requirement: heat,
      processing_time: 200,
      ingredients: [potionInput(from)].concat(reagents.map(I)),
      results: [potionOutput(name)]
    }).id('kubejs:pvp_potions/' + name)
  }

  const families = [
    ['strength', 'awkward', ['minecraft:blaze_powder', 'minecraft:redstone'], true, true],
    ['swiftness', 'awkward', ['minecraft:sugar', 'minecraft:redstone'], true, true],
    ['invisibility', 'night_vision', ['minecraft:fermented_spider_eye', 'minecraft:ender_pearl'], true, false],
    ['regeneration', 'awkward', ['minecraft:ghast_tear', 'create:golden_sheet'], true, true],
    ['healing', 'awkward', ['minecraft:glistering_melon_slice', 'create:golden_sheet'], false, true],
    ['harming', 'poison', ['minecraft:fermented_spider_eye', 'minecraft:gunpowder'], false, true],
    ['poison', 'awkward', ['minecraft:spider_eye', 'minecraft:fermented_spider_eye'], true, true],
    ['weakness', 'water', ['minecraft:fermented_spider_eye', 'minecraft:blaze_powder'], true, false],
    ['slowness', 'swiftness', ['minecraft:fermented_spider_eye', 'minecraft:slime_ball'], true, true],
    ['fire_resistance', 'awkward', ['minecraft:magma_cream', 'minecraft:obsidian'], true, false],
    ['leaping', 'awkward', ['minecraft:rabbit_foot', 'minecraft:slime_ball'], true, true],
    ['turtle_master', 'awkward', ['minecraft:turtle_helmet', 'minecraft:turtle_scute'], true, true],
    ['slow_falling', 'awkward', ['minecraft:phantom_membrane', 'minecraft:feather'], true, false],
    ['wind_charged', 'awkward', ['minecraft:breeze_rod', 'minecraft:wind_charge'], false, false],
    ['weaving', 'awkward', ['minecraft:cobweb', 'minecraft:string'], false, false],
    ['oozing', 'awkward', ['minecraft:slime_block', 'minecraft:slime_ball'], false, false],
    ['infested', 'awkward', ['minecraft:chiseled_stone_bricks', 'minecraft:spider_eye'], false, false]
  ]
  families.forEach(([name, from, reagents, long, strong]) => {
    const late = name === 'invisibility' || name === 'turtle_master' || name === 'regeneration'
    const core = late ? 'overgeared:steel_plate' : 'overgeared:iron_plate'
    mix(name, from, reagents.concat(['create:precision_mechanism', core]),
      late ? 'superheated' : 'heated')
    if (long) mix('long_' + name, name,
      ['minecraft:redstone', 'create:precision_mechanism', core], 'heated')
    if (strong) mix('strong_' + name, name,
      ['minecraft:glowstone_dust', 'create:precision_mechanism', core], 'superheated')
  })
  console.info('[pvp potions] heated Create mixing registered for combat potions')
})
