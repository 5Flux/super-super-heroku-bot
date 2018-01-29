'''
A simple currency bot.
Add roles that are allowed to give currency to others in the server to 'approved_roles'
Use >>give @member {number}
Members can check their balance with >>bank
'''

import discord
from discord.ext import commands
import os,json

#Add the roles that are able to give currency to people
approved_roles=['Currency','Economy Manager','Owner']

def read_json(file_name):
	if file_name.endswith('.json')==False:
		file_name=file_name+'.json'
	if not os.path.isfile(file_name):
		list_name=open(file_name,"w+")
		list_name={}
	else:
		try:
			with open(file_name) as f:
				list_name = json.load(f)
		except ValueError:
			list_name={}
	return list_name

def edit_json(file_name,items):
	if file_name.endswith('.json')==False:
		file_name=file_name+'.json'
	with open(file_name,"w") as f:
		f.write(json.dumps(items))

currency=read_json('currency')

bot = commands.Bot(command_prefix='>>')

@bot.event
async def on_ready():
	print('Logged in as: {}'.format(bot.user))
	print('User ID: {}'.format(bot.user.id))

@bot.command(pass_context=True)
async def give(ctx,member: discord.Member=None, amount: int=None):
	'''Example: >>give @member 100'''
	if amount==None or int(amount)==False:
		await bot.say('Incorrect format.')
		return

	give=False
	author=ctx.message.author
	for role in author.roles:
		if role.name in approved_roles:
			give=True
			break
	if give==True:
		if member.id not in currency:
			currency[member.id]=0
		currency[member.id]+=amount
		edit_json('currency',currency)
		await bot.say("{} has been added to {}'s account".format(amount,member.mention))
	else:
		await bot.say('You do not have permissios to add funds.')

@bot.command(pass_context=True)
async def take(ctx,member: discord.Member=None, amount: int=None):
	'''Example: >>take @member 100'''
	if amount==None or int(amount)==False:
		await bot.say('Incorrect format.')
		return

	take=False
	author=ctx.message.author
	for role in author.roles:
		if role.name in approved_roles:
			take=True
			break
	if take==True:
		if member.id not in currency:
			currency[member.id]=0
		currency[member.id]-=amount
		edit_json('currency',currency)
		await bot.say("{} has been removed from {}'s account".format(amount,member.mention))
	else:
		await bot.say('You do not have permissios to remove funds.')

@bot.command(pass_context=True)
async def bank(ctx):
	'''View your bank account balance'''
	account=ctx.message.author
	await bot.say('{} : **{}**'.format(account.mention,currency[account.id]))


bot.run('Mzk3MjA2MzcyOTg4NzQ3Nzg2.DSsm1Q.Mf73TLo8nsy4dGq46lWN5OOp5r0')
