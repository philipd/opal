VAR end = false
VAR foo = 3

-> the_painting

=== the_painting ===
= description
	The painting is roughly two yards wide and one high.
	-> choices
= choices
	+ Its elegant frame is painted gold[ ...] <>
	  ~ foo = 8
		-> frame
	+ It depicts a country scene[ ...] <>
		-> country_scene
	+ [Exit]
	-> the_end
= frame
	but covered in dust
		-> choices
= country_scene
	with an old watermill in the centre.
		-> choices

=== the_end ===
FIN
~ end = true
~ foo = 6
-> other_end

=== other_end ===
-> END