import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";
import { decode } from "https://deno.land/std@0.69.0/encoding/ascii85.ts";
import { decompress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";
export default parse(
  decompress(
    decode(
      "8:aMe-q-IztDfuO:kniSbI=6^zVUus6s<5EaF{b%(^$R1bz}jDb:5kpA8$?Oa![vNpUrvsH:lTHIGFwRoEb}K*ii/NIK?[BZ6c+[/@50gBxcB:%6+VI=&lRxW]<qD.Wjf}4Jp8)86=U)VFt1K}*MZ+8Gs9=nvuXwbM#7b3Pa4euTsS*jv7L*S[CtYse+Pal[6cjJhs7tRI-ayk.w.U7@ch{!^+L!zJ6oroD{ckZHL4Q-yKRxjR3qZavMO-KKa^)>>Kec5{c-ARZMiUJE{%4zzod9F>^uskvsG[*dNEt4e.em92?=XShVeCZRmD6=dS+5Sa<LJc$2AM-zyvY{mGp{}I]]&Gxebx91ruL20[Z8sHTqaFBTk!KVGNx-.WQUrAp4?tIkW*5MZe:AmYc36)<%-{r8aqG$()M(slaZgjNv&Mshjb6/]$Ueg=q=WwdAVn}BHEP&VaR4<Ix#<@]o!bMZn4lY-FG]!9faA[M9p2$(pUtVY2Lbp$YyfZ9eNFv)BPX0i*[ciQ>9FIsX&)5{g/u[X1mG0.}Irg<kNLy!L66:py^Ht{B(A>j>ewWc*-!/tHlJVc])NE9{nh>V52PFNj.(b>T=DGi.zQK<btx<]#:{a@2<&oRJpM}>Frey}(-/b5wGtw&lwgdFGWzTqv>mVvWiAP3=I0hXBy0GG*$Av>h)iJaX}aZWiJ8FhZ)yK4j{Q99)K^DGel1RO{Y5S&K2!UW{D8Q}i?A%O^gc>j{%7/yYyL1#{3*+A5!TE3g@Lfnv).(7R?-J%[B2El=fYykh}.O.b-Ss%$0>mT76nj0N[Ricun?o82nZdAMgsOv!f0:?^tYv6CsRYbvfsY0wN:T<Y6EN/?X5K:#rb*DpIwnz7Y-7u)$6:IMM.V{RQtO^j(lCMxgv]&fdmec[hHy}&QEg:k&zUlEai+dGr&@g)tV:O>{C>0lJ5kfXh{A4]>RibMf/%PQyt2@jn:z#jV>4L]p@p1WX4t@VNtTd[.{7axT+9vk!1uz^0HQ*&R?)^pfQ3XESyKwfi1i}lNyxRC>1j)w]5*i%5cC^9c7p]!q2&-oHmV[Zd}4ie9N@aDx0*(oV:*g2@9[%Vwv%i1FqI<[rm1!JDtmJ[drjO!s{dGlCMR5YbWm3.<SAo[]<IxknlBLv.Iw&HHiiBgBRE:Tka3L7dj%hV{{VPJtAxXL{.ilCHzLf8/ND:P!OH@sRjQWH%QNo<gP#yKe19.6g?c$w%Od:e+PgJ6BcId1BCheV#F}eq-@)%-2ese#C/-L6/30G&J1vo&!GBuk?PHFQ/lAdIx@ps^EH-h*T0h9.K3@(J?exLoMq?!Siqx6/jV%at{k?03qgY$}JVH<zXv/G)-/i[^",
      { standard: "Z85" },
    ),
  ),
);
