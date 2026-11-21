// Крафты CBC / cbc_at / cbcatfix, перенесённые из сборки «тестовая сборка выживания create».
// Отличия от оригинала: thesilverage:silver_sheet заменён на tfmg:aluminum_sheet
// (мода thesilverage в этой сборке нет).
ServerEvents.recipes(event => {
  event.remove({ output: 'createbigcannons:nethersteel_ingot' })
  // createbigcannons:steel_ingot нет в nosteel-версии CBC — удалять нечего
  event.remove({ output: 'createbigcannons:very_large_cast_mould'})
  event.remove({ output: 'createbigcannons:large_cast_mould' })
  event.remove({ output: 'createbigcannons:medium_cast_mould' })
  event.remove({ output: 'createbigcannons:small_cast_mould' })
  event.remove({ output: 'createbigcannons:very_small_cast_mould' })
  event.remove({ output: 'createbigcannons:sliding_breech_cast_mould' })
  event.remove({ output: 'createbigcannons:cannon_end_cast_mould' })
  event.remove({ output: 'createbigcannons:screw_breech_cast_mould' })
  event.remove({ output: 'cbc_at:rocket_pod_rail_mould' })
  event.remove({ output: 'cbc_at:rocket_pod_breech_mould' })
  event.remove({ output: 'cbc_at:rocket_pod_breech_mould' })
  event.remove({ output: 'createbigcannons:autocannon_breech_cast_mould' })
  event.remove({ output: 'createbigcannons:autocannon_recoil_spring_cast_mould' })
  event.remove({ output: 'createbigcannons:autocannon_barrel_cast_mould' })
  event.remove({ output: 'cbc_at:muzzle_brake_cast_mould' })
  event.remove({ output: 'cbc_at:fume_extractor_cast_mould' })
  event.remove({ output: 'cbc_at:silencer_cast_mould' })
  event.remove({ output: 'cbc_at:rifled_barrel_cast_mould' })
  event.remove({ output: 'cbc_at:autocannon_muzzle_brake_mould' })
  event.remove({ output: 'cbc_at:autocannon_silencer_mould' })
  event.remove({ output: 'cbc_at:twin_autocannon_muzzle_brake_mould' })
  event.remove({ output: 'cbc_at:twin_autocannon_silencer_mould' })
  event.remove({ output: 'cbc_at:twin_autocannon_recoil_spring_mould' })
  event.remove({ output: 'cbc_at:twin_autocannon_breech_mould' })
  event.remove({ output: 'cbc_at:vert_twin_autocannon_muzzle_brake_mould' })
  event.remove({ output: 'cbc_at:vert_twin_autocannon_barrel_mould' })
  event.remove({ output: 'cbc_at:vert_twin_autocannon_silencer_mould' })
  event.remove({ output: 'cbc_at:vert_twin_autocannon_recoil_spring_mould' })
  event.remove({ output: 'cbc_at:vert_twin_autocannon_breech_mould' })
  event.remove({ output: 'cbc_at:heavy_autocannon_muzzle_brake_mould' })
  event.remove({ output: 'cbc_at:heavy_autocannon_barrel_mould' })
  event.remove({ output: 'cbc_at:heavy_autocannon_silencer_mould' })
  event.remove({ output: 'cbc_at:heavy_autocannon_qfbreech_mould' })
  event.remove({ output: 'cbc_at:heavy_autocannon_breech_mould' })
  event.remove({ output: 'cbc_at:heavy_autocannon_recoil_spring_mould' })
  event.remove({ output: 'cbc_at:ap_rocket_item' })
  event.remove({ output: 'cbc_at:flak_rocket_item' })
  event.remove({ output: 'cbc_at:he_rocket_item' })
  event.remove({ output: 'cbc_at:hei_rocket_item' })
  event.remove({ output: 'cbc_at:medium_ap_rocket_item' })
  event.remove({ output: 'cbc_at:medium_he_rocket_item' })
  event.remove({ output: 'cbc_at:medium_heat_rocket_item' })
  event.remove({ output: 'cbc_at:medium_hef_rocket_item' })
  event.remove({ output: 'cbcatfix:big_ap_rocket' })
  event.remove({ output: 'cbcatfix:big_he_rocket' })
  event.remove({ output: 'cbcatfix:big_heat_rocket' })
  event.remove({ output: 'cbcatfix:heavy_he_shell' })
  event.remove({ output: 'cbcatfix:heat_shell' })
  event.remove({ output: 'cbcatfix:hesh_shell' })
  event.remove({ output: 'crowns:heat_exchanger' })
  event.remove({ output: 'tfmg:circuit_board'})
  event.remove({ id: 'createoreexcavation:vein_finder'})
  event.remove({ id: 'create_ultimate_factory:compat/aeronautics_crushing_endstone'})
  event.remove({ id: 'create_ultimate_factory:mixing_gunpowder'})
  event.remove({ id: 'create:crushing/limestone'})
  event.remove({ id: 'create:fill_minecraft_bucket_with_createpropulsion_coral'})
  
  event.recipes.create.sequenced_assembly(
	[
        CreateItem.of('tfmg:circuit_board'), // Main output, will appear in JEI as the result
    ],'tfmg:etched_circuit_board',
	[
        event.recipes.create.deploying('tfmg:unfinished_circuit_board', ['tfmg:unfinished_circuit_board', 'powergrid:capacitor',]),
        event.recipes.create.deploying('tfmg:unfinished_circuit_board', ['tfmg:unfinished_circuit_board', 'powergrid:resistor',]),
        event.recipes.create.deploying('tfmg:unfinished_circuit_board', ['tfmg:unfinished_circuit_board', 'powergrid:bjt_npn',]),
		event.recipes.create.deploying('tfmg:unfinished_circuit_board', ['tfmg:unfinished_circuit_board', 'powergrid:bjt_pnp',]),
		event.recipes.create.deploying('tfmg:unfinished_circuit_board', ['tfmg:unfinished_circuit_board', 'powergrid:resistor',]),
    ]
	).transitionalItem('tfmg:unfinished_circuit_board').loops(3)
	  
  
  
  event.shaped(
  Item.of('cbc_at:flak_rocket_item', 1), // arg 1: output
  [
    ' A ',
    'CBC', // arg 2: the shape (array of strings)
    'EDE'
  ],
  {
    A: 'createbigcannons:shot_balls',
	B: 'createbigcannons:packed_gunpowder' ,
	C: 'minecraft:iron_nugget' ,
	D: 'create:iron_sheet' ,
	E: 'createbigcannons:gunpowder_pinch'
  }
) 
  event.shaped(
  Item.of('cbc_at:ap_rocket_item', 1), // arg 1: output
  [
    ' A ',
    'CBC', // arg 2: the shape (array of strings)
    'EDE'
  ],
  {
    A: 'cbc_at:ha_ap_item',
	B: 'createbigcannons:packed_gunpowder' ,
	C: 'minecraft:iron_nugget' ,
	D: 'create:iron_sheet' ,
	E: 'createbigcannons:gunpowder_pinch'
  }
) 
  event.shaped(
  Item.of('cbc_at:he_rocket_item', 1), // arg 1: output
  [
    ' A ',
    'CBC', // arg 2: the shape (array of strings)
    ' C '
  ],
  {
    A: 'cbc_at:ha_he_item',
	B: 'cbc_at:ap_rocket_item' ,
	C: 'minecraft:redstone'
  }
) 
  event.shaped(
  Item.of('cbc_at:hei_rocket_item', 1), // arg 1: output
  [
    'CAC',
    'CBC', // arg 2: the shape (array of strings)
    'CCC'
  ],
  {
    A: 'minecraft:fire_charge',
	B: 'cbc_at:he_rocket_item' ,
	C: 'minecraft:redstone'
  }
) 
  event.recipes.create.mechanical_crafting('cbc_at:medium_ap_rocket_item', // arg 1: output
  [
    ' A ',
    'CBC', // arg 2: the shape (array of strings)
    'EDE'
  ],
  {
    A: 'cbc_at:ap_rocket_item',
	B: 'createbigcannons:packed_guncotton' ,
	C: 'create:iron_sheet' ,
	D: 'createpropulsion:wing' ,
	E: 'minecraft:gunpowder'
  }
) 
  event.recipes.create.mechanical_crafting('cbc_at:medium_he_rocket_item', // arg 1: output
  [
    'FAF',
    'CBC', // arg 2: the shape (array of strings)
    'EDE'
  ],
  {
    A: 'cbc_at:he_rocket_item',
	B: 'createbigcannons:packed_guncotton' ,
	C: 'create:iron_sheet' ,
	D: 'createpropulsion:wing' ,
	E: 'minecraft:gunpowder',
	F: 'minecraft:redstone'
  }
) 
  event.recipes.create.mechanical_crafting('cbc_at:medium_hef_rocket_item', // arg 1: output
  [
    ' A ',
    'CBC', // arg 2: the shape (array of strings)
    'EDE'
  ],
  {
    A: 'cbc_at:flak_rocket_item',
	B: 'cbc_at:ha_hef_item' ,
	C: 'create:iron_sheet' ,
	D: 'createpropulsion:wing' ,
	E: 'minecraft:gunpowder'
  }
) 
  event.recipes.create.mechanical_crafting('cbc_at:medium_heat_rocket_item', [
    'FAF',
    'CBC', // arg 2: the shape (array of strings)
    'EDE'
  ], {
    A: 'cbc_at:ha_heat_item',
	B: 'cbc_at:ap_rocket_item' ,
	C: 'create:iron_sheet' ,
	D: 'createpropulsion:wing' ,
	E: 'minecraft:gunpowder',
	F: 'minecraft:redstone'
  })
  event.recipes.create.mechanical_crafting('cbcatfix:big_ap_rocket', [
    ' A ',
	'BCB',
    'BCB', // arg 2: the shape (array of strings)
    'DED'
  ], {
    A: 'cbc_at:medium_ap_rocket_item',
	B: 'tfmg:aluminum_sheet' ,
	C: 'createbigcannons:packed_guncotton' ,
	D: 'createpropulsion:tempered_wing' ,
	E: 'createbigcannons:packed_gunpowder'
  })
  event.recipes.create.mechanical_crafting('cbcatfix:big_heat_rocket', [
    ' A ',
	'BCB',
    'BCB', // arg 2: the shape (array of strings)
    'DED'
  ], {
    A: 'cbc_at:medium_heat_rocket_item',
	B: 'tfmg:aluminum_sheet' ,
	C: 'createbigcannons:packed_guncotton' ,
	D: 'createpropulsion:tempered_wing' ,
	E: 'createbigcannons:packed_gunpowder'
  })
  event.recipes.create.mechanical_crafting('cbcatfix:big_he_rocket', [
    'AAA',
	'BEB',
    'CDC', // arg 2: the shape (array of strings)
    'FXF'
  ], {
    A: 'cbc_at:hei_rocket_item',
	B: 'tfmg:aluminum_sheet' ,
	C: 'minecraft:tnt' ,
	D: 'cbcatfix:big_ap_rocket' ,
	E: 'cbc_at:medium_he_rocket_item',
	F: 'createbigcannons:packed_gunpowder',
	X: 'createbigcannons:he_shell'
  })
  event.recipes.create.mechanical_crafting('cbcatfix:heavy_he_shell', [
    'ABA',
	'CDC',
    'ABA', // arg 2: the shape (array of strings)
    'EEE'
  ], {
    A: 'create:iron_sheet',
	B: 'createbigcannons:packed_guncotton' ,
	C: 'minecraft:tnt' ,
	D: 'createbigcannons:he_shell' ,
	E: '#minecraft:wooden_slabs'
  })	
  event.recipes.create.mechanical_crafting('cbcatfix:heat_shell', [
    'ABA',
	'ADA',
    'ACA', // arg 2: the shape (array of strings)
    'EEE'
  ], {
    A: 'create:iron_sheet',
	B: 'cbc_at:ha_heat_item' ,
	C: 'createbigcannons:packed_gunpowder' ,
	D: 'createbigcannons:he_shell' ,
	E: '#minecraft:wooden_slabs'
  })
  event.recipes.create.mechanical_crafting('cbcatfix:hesh_shell', [
    'ABA',
	'ACA',
    'ACA', // arg 2: the shape (array of strings)
    'EEE'
  ], {
    A: 'create:iron_sheet',
	B: 'minecraft:clay' ,
	C: 'createbigcannons:powder_charge' ,
	E: '#minecraft:wooden_slabs'
  })
  
  
  event.shaped(
  Item.of('cbc_at:twin_autocannon_barrel_mould', 1), // arg 1: output
  [
    '   ',
    'AA ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'createbigcannons:autocannon_barrel_cast_mould'
  }
) 
  event.shaped(
  Item.of('cbc_at:vert_twin_autocannon_barrel_mould', 1), // arg 1: output
  [
    'A  ',
    'A  ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'createbigcannons:autocannon_barrel_cast_mould'
  }
) 
  
  event.shaped(
  Item.of('cbc_at:twin_autocannon_recoil_spring_mould', 1), // arg 1: output
  [
    '   ',
    'AA ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'createbigcannons:autocannon_recoil_spring_cast_mould'
  }
) 
  event.shaped(
  Item.of('cbc_at:vert_twin_autocannon_recoil_spring_mould', 1), // arg 1: output
  [
    'A  ',
    'A  ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'createbigcannons:autocannon_recoil_spring_cast_mould'
  }
) 
  
  event.shaped(
  Item.of('cbc_at:twin_autocannon_breech_mould', 1), // arg 1: output
  [
    '   ',
    'AA ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'createbigcannons:autocannon_breech_cast_mould'
  }
) 
  event.shaped(
  Item.of('cbc_at:vert_twin_autocannon_breech_mould', 1), // arg 1: output
  [
    'A  ',
    'A  ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'createbigcannons:autocannon_breech_cast_mould'
  }
) 
  
  event.shaped(
  Item.of('cbc_at:twin_autocannon_silencer_mould', 1), // arg 1: output
  [
    '   ',
    'AA ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'cbc_at:autocannon_silencer_mould'
  }
) 
  event.shaped(
  Item.of('cbc_at:vert_twin_autocannon_silencer_mould', 1), // arg 1: output
  [
    'A  ',
    'A  ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'cbc_at:autocannon_silencer_mould'
  }
) 

event.shaped(
  Item.of('cbc_at:twin_autocannon_muzzle_brake_mould', 1), // arg 1: output
  [
    '   ',
    'AA ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'cbc_at:autocannon_muzzle_brake_mould'
  }
) 
  event.shaped(
  Item.of('cbc_at:vert_twin_autocannon_muzzle_brake_mould', 1), // arg 1: output
  [
    'A  ',
    'A  ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'cbc_at:autocannon_muzzle_brake_mould'
  }
) 
  
  event.shaped(
  Item.of('cbc_at:heavy_autocannon_breech_mould', 1), // arg 1: output
  [
    ' A ',
    'BAB', // arg 2: the shape (array of strings)
    ' A '
  ],
  {
    A: '#minecraft:logs',
	B: 'tfmg:lead_sheet'
  }
) 
  event.shaped(
  Item.of('cbc_at:heavy_autocannon_silencer_mould', 1), // arg 1: output
  [
    ' B ',
    'BAB', // arg 2: the shape (array of strings)
    ' B '
  ],
  {
    A: 'cbc_at:heavy_autocannon_barrel_mould',
	B: 'tfmg:lead_sheet'
  }
) 
  event.recipes.create.cutting('cbc_at:heavy_autocannon_qfbreech_mould', 'cbc_at:heavy_autocannon_breech_mould')
  event.recipes.create.cutting('cbc_at:heavy_autocannon_recoil_spring_mould', 'cbc_at:heavy_autocannon_qfbreech_mould')
  event.recipes.create.cutting('cbc_at:heavy_autocannon_barrel_mould', 'cbc_at:heavy_autocannon_recoil_spring_mould')
  event.recipes.create.cutting('cbc_at:heavy_autocannon_muzzle_brake_mould', 'cbc_at:heavy_autocannon_barrel_mould')
  
  
  event.shaped(
  Item.of('createbigcannons:autocannon_breech_cast_mould', 1), // arg 1: output
  [
    'A  ',
    'A  ', // arg 2: the shape (array of strings)
    'B  '
  ],
  {
    A: '#minecraft:logs',
	B: 'tfmg:lead_sheet'
  }
) 
  event.shaped(
  Item.of('cbc_at:autocannon_silencer_mould', 1), // arg 1: output
  [
    ' B ',
    'BAB', // arg 2: the shape (array of strings)
    ' B '
  ],
  {
    A: 'createbigcannons:autocannon_barrel_cast_mould',
	B: 'tfmg:lead_sheet'
  }
) 
  event.recipes.create.cutting('createbigcannons:autocannon_recoil_spring_cast_mould', 'createbigcannons:autocannon_breech_cast_mould')
  event.recipes.create.cutting('createbigcannons:autocannon_barrel_cast_mould', 'createbigcannons:autocannon_recoil_spring_cast_mould')
  event.recipes.create.cutting('cbc_at:autocannon_muzzle_brake_mould', 'createbigcannons:autocannon_barrel_cast_mould')
   
  event.shaped(
  Item.of('cbc_at:rocket_pod_breech_mould', 1), // arg 1: output
  [
    'AA ',
    'AA ', // arg 2: the shape (array of strings)
    'BB '
  ],
  {
    A: '#minecraft:logs',
	B: 'tfmg:lead_sheet'
  }
) 
  event.recipes.create.cutting('cbc_at:rocket_pod_rail_mould', 'cbc_at:rocket_pod_breech_mould')

  event.shaped(
  Item.of('createbigcannons:very_large_cast_mould', 1), // arg 1: output
  [
    'AAA',
    'AAA', // arg 2: the shape (array of strings)
    'AAA'
  ],
  {
    A: '#minecraft:logs'
  }
) 
  event.recipes.create.cutting('createbigcannons:large_cast_mould', 'createbigcannons:very_large_cast_mould')
  event.recipes.create.cutting('createbigcannons:medium_cast_mould', 'createbigcannons:large_cast_mould')
  event.recipes.create.cutting('createbigcannons:small_cast_mould', 'createbigcannons:medium_cast_mould')
  event.recipes.create.cutting('createbigcannons:very_small_cast_mould', 'createbigcannons:small_cast_mould')
  event.recipes.create.cutting('cbc_at:muzzle_brake_cast_mould', 'createbigcannons:very_small_cast_mould')
  event.recipes.create.cutting('cbc_at:fume_extractor_cast_mould', 'cbc_at:muzzle_brake_cast_mould')
  event.recipes.create.cutting('cbc_at:rifled_barrel_cast_mould', 'cbc_at:fume_extractor_cast_mould')
  event.recipes.create.cutting('cbc_at:silencer_cast_mould', 'cbc_at:rifled_barrel_cast_mould')
  
  event.shaped(
  Item.of('createbigcannons:sliding_breech_cast_mould', 1), // arg 1: output
  [
    'AAA',
    'AAA', // arg 2: the shape (array of strings)
    'A A'
  ],
  {
    A: '#minecraft:logs'
  }
) 
  event.recipes.create.cutting('createbigcannons:cannon_end_cast_mould', 'createbigcannons:sliding_breech_cast_mould')
  event.recipes.create.cutting('createbigcannons:screw_breech_cast_mould', 'createbigcannons:cannon_end_cast_mould')
  
  event.recipes.create.compacting('2x createbigcannons:nethersteel_ingot', ['minecraft:netherite_ingot', '4x tfmg:steel_ingot']).superheated()
  event.recipes.create.compacting('2x createbigcannons:nethersteel_ingot', ['minecraft:netherite_ingot', '8x createbigcannons:cast_iron_ingot']).superheated() 
  
  
  event.remove({ output: 'createbigcannons:solid_shot' })
  event.shaped(
  Item.of('createbigcannons:solid_shot', 1), // arg 1: output
  [
    ' A ',
    ' B ', // arg 2: the shape (array of strings)
    ' C '
  ],
  {
    A: 'minecraft:iron_nugget',
    B: 'minecraft:iron_ingot',  //arg 3: the mapping object
	C: '#minecraft:wooden_slabs'
  }
)

    event.shaped(
  Item.of('minecraft:white_wool', 1), // arg 1: output
  [
    'AA ',
    'AA ', // arg 2: the shape (array of strings)
    '   '
  ],
  {
    A: 'naturalist:fur'
  }
) 

event.smelting('minecraft:rabbit_hide', 'minecraft:rotten_flesh')
event.smelting('farmersdelight:fried_egg', 'naturalist:alligator_egg')
event.smelting('farmersdelight:fried_egg', 'naturalist:tortoise_egg')
event.smelting('farmersdelight:fried_egg', 'naturalist:duck_egg')
  console.log('Hello! The recipe event has fired!');
})
  