// A press must have one deterministic output for each metal.
ServerEvents.recipes(event => {

  // --- pack guard: content for mods that are not installed is skipped ---
  const __has = id => { try { return Item.exists(id) } catch (e) { return false } }
  const __need = ['pipeorgans:brass_reed']
  const __missing = __need.filter(function (id) { return !__has(id) })
  if (__missing.length) { console.info('[skip] zz_plate_unification.js: missing ' + __missing.join(', ')); return }
  ;[
    ['createdeco:andesite_sheet', 'createcasing:andesite_sheet'],
    ['createdeco:zinc_sheet', 'createcasing:zinc_sheet'],
    ['powergrid:zinc_sheet', 'createcasing:zinc_sheet']
  ].forEach(pair => {
    event.replaceInput({}, pair[0], pair[1])
    event.remove({ output: pair[0] })
  })
  event.remove({ id: 'pipeorgans:pressing/brass_reed' })
  event.custom({ type: 'create:cutting', ingredients: [{ item: 'create:brass_sheet' }],
    results: [{ id: 'pipeorgans:brass_reed', count: 9 }], processing_time: 80
  }).id('kubejs:plate_unification/brass_reeds')
})
