module.exports = function (router) {
    router.route('/discussions/create').post(require('../controllers/disscussions').createDiscussion)
}