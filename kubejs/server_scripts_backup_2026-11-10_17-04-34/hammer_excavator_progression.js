// Heavy 3x3 tools follow the same forged-metal progression as normal equipment.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['overgeared:iron_plate', 'onlyhammersandexcavators:iron_hammer']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] hammer_excavator_progression.js: missing ' + __missing.join(', ')); return }
  const I = id => ({ item: id })
  const T = id => ({ tag: id })
  const id = (metal, tool) => 'onlyhammersandexcavators:' + metal + '_' + tool
  const add = (metal, tool, pattern, key, forged) => {
    const output = id(metal, tool)
    event.remove({ output })
    const recipe = { type: forged ? 'overgeared:forging' : 'minecraft:crafting_shaped',
      category: forged ? 'misc' : 'equipment', pattern, key,
      result: { id: output, count: 1 } }
    if (forged) { recipe.hammering = 5; recipe.has_quality = false; recipe.needs_minigame = false }
    event.custom(recipe).id('kubejs:heavy_tools/' + metal + '_' + tool)
  }
  ;['hammer', 'excavator'].forEach(tool => {
    const normal = tool === 'hammer' ? 'pickaxe' : 'shovel'
    const shape = tool === 'hammer' ? ['PHP', ' R ', ' S '] : [' P ', 'PHP', 'RS ']
    // Wood and stone stay attainable before the first metal workshop.
    add('wooden', tool, shape, { P: T('minecraft:logs'), H: I('minecraft:wooden_' + normal),
      R: I('minecraft:string'), S: I('minecraft:stick') }, false)
    add('stone', tool, shape, { P: T('minecraft:stone_tool_materials'), H: I('minecraft:stone_' + normal),
      R: I('minecraft:string'), S: I('minecraft:stick') }, false)
    // No leather is needed for the iron stage. The head and plates can be forged by hand.
    add('iron', tool, shape, { P: I('overgeared:iron_plate'), H: I('overgeared:iron_' + normal + '_head'),
      R: I(id('stone', tool)), S: I('create:andesite_alloy') }, true)
    add('gold', tool, shape, { P: I('create:golden_sheet'), H: I('overgeared:golden_' + normal + '_head'),
      R: I(id('iron', tool)), S: I('overgeared:iron_plate') }, true)
    ;[['lapis', 'minecraft:lapis_block'], ['redstone', 'minecraft:redstone_block']].forEach(pair => {
      add(pair[0], tool, shape, { P: I(pair[1]), H: I('create:precision_mechanism'),
        R: I(id('iron', tool)), S: I('overgeared:steel_plate') }, false)
    })
    event.remove({ output: id('diamond', tool) })
    event.custom({ type: 'minecraft:smithing_transform',
      template: I('overgeared:diamond_upgrade_smithing_template'), base: I(id('iron', tool)),
      addition: I('minecraft:diamond_block'), result: { id: id('diamond', tool), count: 1 }
    }).id('kubejs:heavy_tools/diamond_' + tool)
    add('obsidian', tool, shape, { P: I('minecraft:obsidian'), H: I('create:sturdy_sheet'),
      R: I(id('diamond', tool)), S: I('overgeared:steel_plate') }, false)
    add('emerald', tool, shape, { P: I('minecraft:emerald_block'), H: I('create:precision_mechanism'),
      R: I(id('diamond', tool)), S: I('overgeared:steel_plate') }, false)
    event.remove({ output: id('netherite', tool) })
    event.custom({ type: 'minecraft:smithing_transform',
      template: I('minecraft:netherite_upgrade_smithing_template'), base: I(id('diamond', tool)),
      addition: I('minecraft:netherite_block'), result: { id: id('netherite', tool), count: 1 }
    }).id('kubejs:heavy_tools/netherite_' + tool)
  })
  console.info('[heavy tools] 20 hammer/excavator progression recipes registered')
})
