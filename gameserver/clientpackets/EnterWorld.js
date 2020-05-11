let config = require("./../../config/config");
let serverPackets = require("./../../gameserver/serverpackets/serverPackets");
let ClientPacket = require("./ClientPacket");
let announcements = require("./../../gameserver/Announcements");
let html = require("./../../gameserver/Html");
let world = require("./../../gameserver/World");

class EnterWorld {
	constructor(packet, player) {
		this._packet = packet;
		this._player = player;
		this._data = new ClientPacket(this._packet.getBuffer());
		this._data.readC()

		this._init();
	}

	_init() {
		announcements.each(announcement => {
			this._player.sendPacket(new serverPackets.CreateSay(this._player, config.base.MESSAGE_TYPE.ANNOUNCEMENT, announcement));
		})

		this._player.sendPacket(new serverPackets.SunRise());
		this._player.sendPacket(new serverPackets.UserInfo(this._player));
		this._player.sendPacket(new serverPackets.ItemList(this._player));

		//this._player.sendPacket(new serverPackets.TutorialShowHtml(html.get("tutorial_001"))); // fix
		//this._player.sendPacket(new serverPackets.Ride(this._player));
		this._player.broadcast(new serverPackets.CharacterInfo(this._player)); // Оповестить всех, что персонаж зашел в мир

		this._player.getVisibleObjects(world.getNpcList(), npc => {
			this._player.sendPacket(new serverPackets.NpcInfo(npc, this._player));
		})

		this._player.getVisiblePlayers(world.getPlayers(), anotherPlayer => {
			this._player.sendPacket(new serverPackets.CharacterInfo(anotherPlayer));
		});

		this._player.getVisiblePlayers(world.getBots(), bot => {
			this._player.sendPacket(new serverPackets.CharacterInfo(bot));
		});
	}
}

module.exports = EnterWorld;