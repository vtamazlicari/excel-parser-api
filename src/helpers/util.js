
function ifExist(name, model) {
  return new Promise((resolve, reject) => {
    model.findById({name: name})
      .then(data => {
        if (data) {
          resolve();
        } else resolve('ITEM_EXIST');
      })
      .catch((error) => {
        reject(error);
      })
  });
}

module.exports = {
  ifExist
};