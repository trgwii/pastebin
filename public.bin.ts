import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";
import { decode } from "https://deno.land/std@0.74.0/encoding/ascii85.ts";
import { decompress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";
export default parse(
  decompress(
    decode(
      "8-n99-ikPy4!mLk[W85Y0)COBAFLG?j.n2Mb+Ez2X3>=1ZkD!:I:MFbrXO)OYQ)%]]J$OKY^HIol):WDlaemadeU/GW-!I#GVT%e?Gf9PMBnO<f4.35jFc}<D/Zz*Ao$ECpX@jw=wlpQ.h1YmwibontO:j4CLAa((){rakBoMrdO9A^=^K$:vu7M9@Q=lG?-yw-Qo7Q8Eh#AEk:(EwJ(l7n&93ODh5g8iwT=T=QGiH&1)>vH6k7FyuLh}.QAoUSAV=z/KC+ZRJe/Sw9NKZ5dan)s[vV-nLTswb4bW06gp>:I(?eGTz%%LV3<:mp4UfD2/8.m.]U(]/7&Y<C)W]q-(5U^*PiyV*QzLK5D8$fRt{Ql8/Fi-z@C}3pfGp/3zKO73pI})jjbDzLNjT2(rK<YJ8j4]EWKUeS}[R!{<diXu{r.337QHCY9c+:(/{NsmuUpHa5k)?t1$S5&zi!M2!(GrePs!C:J4(Cz.(yqnoOraaO2!.L7bK6I!32+JDlE2n@IDFqL-V]Msl4sv8He}$Wme){SD>o?NeHV9UNolEGa]W%1?[0K@9nXIEvnv/j9M>)*2ZUe2:Yo.xP&XVbm!(5POl:oJt-JeCa=<Ih?6B(OHO4}F)5i){q!=pyzDgW:x]iRAo>x(q{yLygxmoh<*.bF3Vo@zFAokncsgT}fvtXs5EJ-*GEgPc8^WHXFGf}bH[3ng6)O=842q7&0.gz?89cUhqAn?6k:q}9k.@s0uJ[Fy82d&}TMu8yffBsx+DdaK*o3z=u<jvgvW5)5wBBoGw0FYK.qSGt-o^/RbB!:46=:-6QDi{+8ia7N[(&)J2:dpK@j!)<vct0}E>x<C413oZdoOWz+992FogYQ)FAC:+Le2k-rm6WUK$&M<7?$Ztp{6=5Cr!a&tCecKCWYnSaLip-NV5x%a!7rdv6sWlgiUgZI{jQ1]WtrFJaua*3-=xcn{jcWme7haK@/]z4M(lmKm^}JZ]X@^]yLAmS2bfFj@0H/ltsi^ssC$*v*X754#JKfp/H#BrLSaQnAS:5v8a7w@FU)!uuW?3Z-X8[:xR5d0xyHDzL]=xXm272G4[wUDfcFS<a?1y?#wew)w]gaGozJhrT%[kTQ=sMZiGqq=R4smUF&2a)ksDKAj8<}[EG1sq=}0.reJySu4AmZq3XP&HFsjYShp7gBHXATAH(S}:C-0N:]>vb9QNTUnu-JplqH0%}aEHX0AtR=L+@e*0HQfEpHSUy@*b1EA5:/hLcEc.iDATEN3Fu&waVEOI4Ho$X{kk$}%G-1Z7KCMFO3t-}Ko]D80U7#^?<dum?4!rq8tp<G><].L8yc:Q.Ebt*FFiKTx7vOqemXxCB9VshEobs(NAK!WgVih!:/LnR+Qm(D]ve8)9@k5OC[30vr8f?R{sO#?9XR6O%AVx3MpZ-csO{I:?8D9WyL^u>4t)DF?7NdaIxk#EPmD1qD-Upk0{=oSUqXxOfQ+XPzTGU&fu5e8Vb[0mEqf<dRhT.oe2DP?pQSDMVH8.JKk6hY63=HK)yz^]TGAj+LDGUpAIr(U*J7-:!C6:ZOKtk2aF$>Or758weQu)xBevKVYi6Y7sa)weKM&9<DI&B(ZQ[&{$FB>^*u",
      { standard: "Z85" },
    ),
  ),
);
