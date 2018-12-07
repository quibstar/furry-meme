export function categoryFilter(arr, filterOn) {
  let cats = arr.filter(c => c.usedOn === filterOn);
  if (cats.length === 1) {
    let options = cats[0].categories;
    return options;
  }
}
