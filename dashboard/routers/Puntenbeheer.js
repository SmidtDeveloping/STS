const express = require('express');
const router = express.Router();
const client = require("../../src/botClient")
const Item = require('../../db/Punten').User;

router.get('/dashboard/punten/zoek', async (req, res) => {
  try {
    const items = await Item.find();
    const guild = client.guilds.cache.get(req.session.guildid).members; 
    res.render('stats/Punten', {data: { items: items, guild: guild }});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Er is een fout opgetreden bij het zoeken naar punten.");
  }
});

router.get("/dashboard/punten/beheer", async (req, res) => {
  try {
    const bankAccount = await Item.findOne({userId: req.query.userid}).exec();
    if (!bankAccount) {
      // Als er geen bankrekening is gevonden, stuur dan een foutmelding naar de client
      return res.status(404).send("Puntenrekening niet gevonden.");
    }
    res.render('stats/PuntenBeheer', {bank: bankAccount});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Er is een fout opgetreden bij het beheren van de punten.");
  }
});


router.post('/dashboard/punten/beheer', async (req, res) => {
  try {
    let { punt, woord } = req.body;

    // Zoek het huidige bankrekeningobject
    const bankAccount = await Item.findOne({userId: req.query.userid}).exec();

    // Als een veld leeg is, houd dan de oude waarde
    if (!punt) {
      punt = bankAccount.punten;
    }
    if (!woord) {
      woord = bankAccount.woordenGeraden;
    }

    // Update de bankrekening met de nieuwe waarden
    const updatedBankAccount = await Item.findOneAndUpdate({userId: req.query.userid}, { punten: punt, woordenGeraden: woord }, { new: true }).exec();

    if (!updatedBankAccount) {
      console.error("Geen punten bijgewerkt.");
      return res.status(404).send("Kan de Puntenrekening niet bijwerken.");
    }


    res.redirect('/dashboard');
  } catch (error) {
    console.error("Fout bij het bijwerken van de puntenrekening:", error);
    res.status(500).send("Er is een fout opgetreden bij het bijwerken van de puntenrekening.");
  }
});


module.exports = router;
