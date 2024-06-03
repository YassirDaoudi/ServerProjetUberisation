module.exports = (router)=>{
    router.route("/projects/create").post(require("../controllers/projects").insert)
    router.route("/projects/getAll").get(require("../controllers/projects").getAll)
}