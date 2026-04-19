# Log Module
_ = require 'underscore'

size = (obj)->
	count = 0
	for key of obj
		count++
	return count

objectFormat = (arg)->
	result = '\n\t{'
	obj = for key, value of arg
		key+' : '+format(value, '\n\t')
	result += obj.join ''
	result += '}'
	return result

format = ->
	results = []
	if arguments.length == 1 and _.isFunction(arguments[0])
		func = arguments[0]
		if size(func)  # If function has properties
			results.push '\t'+func.toString()
			results.push objectFormat(func)
			return results
		else
			return func.toString()
	for arg in arguments
		if _.isString(arg) or _.isNumber(arg) or _.isNaN(arg) or _.isBoolean(arg) or _.isRegExp(arg)
			results.push arg
		else if _.isFunction(arg)
			f_size = size(arg)
			f_size = if f_size then " {#{f_size}}" else ''

			f_name = if arg.name then " #{arg.name} " else ''

			results.push "<Function#{f_name}#{f_size}>"

		else if _.isNull(arg)
			results.push 'null'
		else if _.isUndefined(arg)
			results.push 'undefined'
		else if _.isDate(arg)
			d = arg.getDate()
			m = arg.getMonth()
			y = arg.getFullYear()
			h = arg.getHours()
			i = arg.getMinutes()
			s = arg.getSeconds()
			results.push "|#{m}-#{d}-#{y}" + if h then " #{h}:#{m}:#{s}|" else '|'
		else if _.isArray(arg) or _.isArguments(arg)
			result = '['
			result+= (for val in format.apply(this, arg).split('\n')
				val+'\n\t'  # Indent it more.
				).join('')
			result += ']'
			results.push result
		else if _.isObject(arg)
			if arguments[1] == '\n\t'  # A loop
				result = '{Object}'
			else
				result = objectFormat(arg)
			results.push result
		else
			results.push 'ELSE_TYPE: '+arg+' ['+typeof arg+']'
	return results.join(', ')

module.exports = ->
	# Output Object Introspection
	return ' log: '+format.apply this, arguments

module.exports.log = ->
	console.log module.exports.apply this, arguments

# So you can do `{qlog} = require 'qlog'` to get log method
module.exports.qlog = module.exports.log
