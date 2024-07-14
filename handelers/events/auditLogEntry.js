const { Events, EmbedBuilder, AuditLogEvent  } = require('discord.js');
const path = require('path');
const fs = require('fs');
const auditLogFile = path.join(__dirname, 'auditLogs.json');
const client = require("../../src/botClient")
const readAuditLogs = () => {
    if (!fs.existsSync(auditLogFile)) {
        return [];
    }
    const data = fs.readFileSync(auditLogFile);
    return JSON.parse(data);
};

const writeAuditLogs = (logs) => {
    fs.writeFileSync(auditLogFile, JSON.stringify(logs, null, 2));
};

let auditLogs = readAuditLogs();


async function execute(auditLog) {
    const { action, extra: channel, executorId, targetId } = auditLog;
    console.log(auditLog);
	if (action !== AuditLogEvent.MessageDelete) return;
	const executor = await client.users.fetch(executorId);
	const target = await client.users.fetch(targetId);
    console.log(`A message by ${target.tag} was deleted by ${executor.tag} in ${channel.name}.`);


}


module.exports = {
	name: Events.GuildAuditLogEntryCreate,
	execute: execute,
};