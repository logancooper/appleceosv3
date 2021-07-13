"use strict"

const slugify = require("slugify");
const express = require("express");
const router = express.Router();
const {ceos} = require("../models");

router.get("/:slug?", async (req, res) => {

    if(!!req.params.slug)
    {
        const slug = req.params.slug;
        const ExecutiveData = await ceos.findOne({where:{slug}});
        res.render("template", {
            locals: {
                title: "CEO DETAILS",
                ceo: ExecutiveData,
            },
            partials: {
                body: "partials/ceo-details",
            }
        })
    }
    else
    {
        const ExecutiveData = await ceos.findAll();
        //console.log(ExecutiveData);
        res.render("template", {
            locals: {
                title: "Home Page",
                data: ExecutiveData
            },
            partials: {
                body: "partials/home",
            }
        });
    }

});

router.post("/", async (req, res) => {
    //console.log("The Request Body is: ", req.body);
    const {ceo_name, ceo_year} = req.body;

    const slug = slugify(ceo_name, {
        replacement: "_",
        lower: true,
        strict: true
    });

    //const newExecutive = new ExecutiveModel(null, ceo_name, slug, ceo_year);

    const response = await ceos.create({
        name: ceo_name, 
        slug: slug, 
        first_year_active: ceo_year
    });

    console.log("POST ROUTE RESPONSE: ", response);
    res.redirect("/");
});

router.post("/delete", async (req, res) => {
    const {id, ceo_name, slug, ceo_year} = req.body;

    //const executiveToDelete = new ExecutiveModel(id, ceo_name, slug, ceo_year);

    const response = await ceos.destroy({
        where: {id},
    });
    console.log("DELETE ROUTE RESPONSE IS: ", response);
    res.redirect("/");
})

module.exports = router;