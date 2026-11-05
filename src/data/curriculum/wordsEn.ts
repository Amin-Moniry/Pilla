import { unique } from './random';

const split = (s: string) => s.split(/\s+/).filter(Boolean);

/** ~700 of the most common English words (lowercase, letters only). */
export const EN_COMMON: string[] = unique(
  split(`
the of and to in is you that it he was for on are as with his they at be this from have or by one had not but
what all were when we there can an your which their said if do will each about how up out them then she many
some so these would other into has more her two like him see time could no make than first been its who now
people my made over did down only way find use may water long little very after words called just where most
know get through back much before go good new write our me man too any day same right look think also around
another came come work three word must because does part even place well such here take why help put different
away again off went old number great tell men say small every found still between name should home big give air
line set own under read last never us left end along while might next sound below saw something thought both few
those always looked show large often together asked house world going want school important until form food keep
children feet land side without boy once animals life enough took sometimes four head above kind began almost live
page got earth need far hand high year mother light country father let night picture being study second soon story
since white ever paper hard near sentence better best across during today however sure knew try told young sun
thing whole hear example heard several change answer room sea against top turned learn point city play toward five
using himself usually money seen car morning added friend easy idea fish mountain north base horse cut watch color
face wood main open seem walk ease group music mark letter mile river care book carry science eat stop plain girl
usual ready red list though feel talk bird body dog family direct leave song measure door product black short class
wind question happen complete ship area half rock order fire south problem piece pass farm king size hour true
hundred remember step early hold west ground interest reach fast sing listen six table travel less ten simple
vowel war lay pattern slow center love person serve appear road map rain rule pull cold notice voice unit power
town fine certain fly fall lead cry dark machine note wait plan figure star box field rest correct able pound done
beauty drive stood contain front teach week final gave green quick develop ocean warm free minute strong special
mind behind clear tail produce fact street inch nothing course stay wheel full force blue object decide surface
deep moon island foot system busy test record boat common gold possible plane dry wonder laugh thousand ago ran
check game shape hot miss brought heat snow bring yes distant fill east paint language among grand ball yet wave
drop heart present heavy dance engine position arm wide sail material fraction forest sit race window store summer
train sleep prove lone leg exercise wall catch mount wish sky board joy winter sat written wild instrument kept
glass grass cow job edge sign visit past soft fun bright gas weather month million bear finish happy hope flower
clothe strange gone jump baby eight village meet root buy raise solve metal whether push seven paragraph third
shall held hair describe cook floor either result burn hill safe cat century consider type law bit coast copy
phrase silent tall sand soil roll temperature finger industry value fight lie beat excite natural view sense ear
else quite broke case middle kill son lake moment scale loud spring observe child straight consonant nation
dictionary milk speed method organ pay age section dress cloud surprise quiet stone tiny climb cool design poor
lot experiment bottom key iron single stick flat twenty skin smile crease hole trade melody trip office receive
row mouth exact symbol die least trouble shout except wrote seed tone join suggest clean break lady yard rise
bad blow oil blood touch grew cent mix team wire cost lost brown wear garden equal sent choose fell fit flow
fair bank collect save control decimal gentle woman captain practice separate difficult doctor please protect
noon whose locate ring character insect caught period indicate radio spoke atom human history effect electric
expect crop modern element hit student corner party supply bone rail imagine provide agree thus capital
chair danger fruit rich thick soldier process operate guess necessary sharp wing create neighbor wash bat rather
crowd corn compare poem string bell depend meat rub tube famous dollar stream fear sight thin triangle planet
hurry chief colony clock mine tie enter major fresh search send yellow gun allow print dead spot desert suit
current lift rose continue block chart hat sell success company subtract event particular deal swim term
opposite wife shoe shoulder spread arrange camp invent cotton born determine quart nine truck noise level chance
gather shop stretch throw shine property column molecule select wrong gray repeat require broad prepare salt nose
plural anger claim continent oxygen sugar death pretty skill women season solution magnet silver thank branch
match suffix especially fig afraid huge sister steel discuss forward similar guide experience score apple bought
led pitch coat mass card band rope slip win dream evening condition feed tool total basic smell valley nor double
seat arrive master track parent shore division sheet substance favor connect post spend chord fat glad original
share station dad bread charge proper bar offer segment slave duck instant market degree populate chick dear
enemy reply drink occur support speech nature range steam motion path liquid log meant quotient teeth shell neck
`)
);

/** Hand-written drill words for restricted key pools — all safe, real words. */
export const EN_DRILL: string[] = unique(
  split(`
a as ad ads ah ash ask add all alas dad dads dash fad fads fall falls flag flags flak flash flask gal gals gall
gas glad hall halls half has had hash lad lads lag lags lash lass sad sag saga sags salad salsa shall slash
jag gash dash slash sash galas

a at as ad add are art arts area aware award awards bad bag bags bar bars base bat beast beat bed bee beer best
better beta brag brass bread breast brew cab cafe car card care cart cast cat crab craft crave crest dad dare
dart data date dear debt dress drag draw dream ear east eat edge egg ever exam exact extra fact far fare fast
fear feast feat fee few fret gas gate gear get grab grass great greet grew gave race rate raw rat read rest
safe sat save saw scare sea seat secret see set sew star stare state steer sweat sweet swear tab tag tax tea
tear test text tree trace track trade tread treat wage wag war was wave wax weave wear web wed were west wet
zebra zest exceed excess aftereffect reward rewards sweater sweaters fastest greatest dessert desserts
create created crazed graded traded watered tweets starve stress strewn farewell

hill hip him hop hum hump hymn ill in ink kin kill kiln lip lumpy lily limp link lion loop lop lull milk mill
mini mink minimum million mom moon mono mop monopoly no noon nook nil nip nun oil on onion only opinion pin pink
pill poll pony pop pull pump puppy pylon union unhook uphill you yolk yum ploy polio phylum minion nylon mull
kook lunch hullo nylon holy homily phony ninny

type typewriter quiet pepper power tower pretty property output proper writer write poetry your yet wet we up
tip top pit pot pet put rope ripe repute retire require quote equip tire tore tree true trip trout troupe erupt
upper opera otter outer pewter poet prior purr quip rip riot rite root route toy try tow two tutor euro
pierce pottery tripper trooper

ice ace age ale ape arc ark arm art ash ate awe axe bad bag ban bar bat bay bed bee bet bid big bit boa bog box
boy bud bug bun bus but buy cab can cap car cat cop cow cry cub cup cut dam day den dew did dig dim dip dog dot
dry dub dug dye ear eat egg ego elf elm end era eve eye fan far fat fed fee few fig fin fit fix fly fog for fox
fry fun fur gap gas gem get gin god got gum gun gut guy gym ham hat hay hen hid him hip his hit hog hop hot how
hub hug hum hut ink inn ion jam jar jaw jet job jog joy jug key kid kit lab lad lap law lay led leg let lid lie
lip log lot low mad man map mat may men met mix mob mud mug nap net new nod nor not now nut oak oar oat odd off
oil old one orb our out owl own pad pan pat paw pay pea peg pen pet pie pig pin pit pop pot pub pup rag ram ran
rat raw ray red rib rid rim rip rob rod rot row rub rug rum run rye sad sag sap sat saw say sea see set sew shy
sin sip sit six ski sky sly sob son sow soy spy sub sum sun tab tag tan tap tar tax tea ten the tie tin tip toe
ton too top toy try tub tug two urn use van vat vet via vow wag war was wax way web wed wet who why wig win wit
woe won wow yak yam yes yet you zip zoo
`)
);

export const EN_ALL_WORDS: string[] = unique([...EN_DRILL, ...EN_COMMON]).filter((w) => /^[a-z]+$/.test(w));

/** Very common 2-letter / 3-letter / 4-letter-plus buckets are derived on demand by length. */

export const EN_BIGRAMS = ['th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'en', 'nd', 'ti', 'es', 'or', 'te', 'of', 'ed', 'is', 'it', 'al', 'ar', 'st', 'to', 'nt', 'ng', 'se', 'ha', 'as', 'ou', 'io', 'le', 've', 'co', 'me', 'de', 'hi', 'ri', 'ro', 'ic', 'ne', 'ea', 'ra', 'ce'];
export const EN_TRIGRAMS = ['the', 'and', 'ing', 'ion', 'tio', 'ent', 'ati', 'for', 'her', 'ter', 'hat', 'tha', 'ere', 'ate', 'his', 'con', 'res', 'ver', 'all', 'ons', 'nce', 'men', 'ith', 'ted', 'ers', 'pro', 'thi', 'wit', 'are', 'ess', 'not', 'ive', 'was', 'ect', 'rea', 'com', 'eve', 'per', 'int', 'est', 'sta', 'cti', 'ica', 'ist', 'ear', 'ain', 'one', 'our', 'iti', 'rat'];
export const EN_ENDINGS = ['ing', 'tion', 'ed', 'ly', 'er', 'est', 'ness', 'ment', 'able', 'ful', 'less', 'ous', 'ity', 'ive', 'al', 'ize', 'ence', 'ance', 'ship', 'ward'];
