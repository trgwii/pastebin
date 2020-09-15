import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";
import { decode } from "https://deno.land/std@0.69.0/encoding/ascii85.ts";
import { decompress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";
export default parse(
  decompress(
    decode(
      "8%W[j-q:hQ)[WU==f1(15EQQGI]g!kqc]W#iE<e}{*mKCcYg}yKRT[Wt?H1jj=pSxu0MA+nHc2U!7BGXksS8(Uzok5V[g2mPS3@rYO&VMwe!tj>3O6:6Tl%451Zea:^%8Z[}dEn/jl@zcW(&[Mk]=gYyFhfx<Ie%xPb9Y@.d[1EF#SA+!irT:vpc)Rb[Pt=TL&TgJSD.Z!(DTP9dt2}wwY$1leQdM}QWN4785s2<lKS!XMg.C-fP={}OaFahWK+GfK7-zTr2PD)z2Xqd&(RH^W<Ck%F:n-vbfmc3(TN75Nt[Xf2k7XJtX+^xQ:o/berO:K&lNY8e^M3UT]FEmtl!-7j^kQmGqi)8Lniw0G0Wpp60{vy}nu1oW0DCidMhzJl.#X%R>C<g$06:#5KTQlO9R*6q%l2p$BQQLS]lyB+1}h!Me1TU)5Ix{OZ<+pJgEhNe5}iDQCuMFXhaWlY3H]qlTML-ZCez<)f4fa>W5!I^kRQ#q[!f-8VVVguh:Y+z?>0LTL6}UwAS{/YRk./IyJNDoQK2:wF?dBozp^Uy9KxlUhw4w)5D)}@ZhWqT)bClsh&Np?FiYWqQ30mS$/N/&TjxU?yPtsUo0v3yAVe0/=vMm]!?&q/fd-5msMD+Q&n8BLY=vvpwBBz=xC@ymh]WJC[4GJe.C*J2RN1cvLVNMz#HphrNSMT)1g[?r}ed6/equGnc<<-oyYWw:#Yq#^h$yU-=AC)Q%u)#L3Soz3wF+pUU-.Vu&uK=Snn!8V<Ckz21*QSxc#h<DZgBHi!FZnzUjlxHo4sL4Nwp[2N*o?c&g!R@XnU{3SZxbdFv>){6jgdYLLGCqfVSttc4sU!L{K7CQ[FPyY+YBhUPM&}K/XH%=n269C^Z9bO}2{AH!A+8uZqBu%F}n{2AbHw8B6BPZ}dQuk%y7Yb(9T:L}xH(rf!*DoIg+{#.n@G&^?8:ae!bl$/kAp{c)*9EAV=k*#NoQm[Wr#9yA$8ba-<!GGv!$8*?aVn$qWAm$w9%lV5>3F2b}{e@M5?9+Si0L00!6bjAl<dkS^eHxS&kz=U+ZaPE-.L7z@[>JMjE4j2uZJl/^{F]@@hTbec2Ion)1fu]eo:PyxjwpxMR7]X*glEgMU(CgcJS=Y)hVmET<p@iafKkJF0Z6nKu%?6}M6&?b>[)yTB68ls$}ySmH>%QW?6Q21:C7o]g{8x?XU/Y<]$nRX2EPguk9l>1BF$H(3i7/a41hkfuv+BsETg[[d-un[/?TR)6:.{2!@R&}Y#YQff}Ai-A4uN&JrnOsBbt=nBrbCK<(Mxj^=@3Wj^#!0ab#Uvg}&JN3T(e1JaEfmUH)[4nhp-kG14)D]/p(hZsoY&6r*v1mQF]Fe09)hIQ-@t)byO}FlWCMpEFBz&g{g7#O1w$(mV6DKT<K>KKBe1sRxhRMViK.HCYRs6i!O+kudU#(rZiRkG&f7[v#}KfWl-vT25>$we]VkA",
      { standard: "Z85" },
    ),
  ),
);
