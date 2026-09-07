# Icones do deck Claude on Azure

## Azure (pasta azure/)
Recorte do pacote oficial Azure architecture icons, Azure_Public_Service_Icons_V24,
baixado de learn.microsoft.com/azure/architecture/icons.

Termos, na letra da Microsoft: "Microsoft permits the use of these icons in
architectural diagrams, training materials, or documentation. You can copy,
distribute, and display the icons only for the permitted use unless granted
explicit permission by Microsoft. Microsoft reserves all other rights."

Regras de uso que valem para o deck: nao cortar, espelhar ou girar, nao distorcer,
e nao usar icone de produto Microsoft para representar produto que nao seja da
Microsoft. O pacote completo, com 714 icones, esta em ../azure_icons.

## GitHub (dentro de brands/, e no sprite do deck)
A familia GitHub usa Octicons, o proprio sistema de icones do GitHub, MIT:
mark-github, copilot, workflow para Actions, codespaces e shield-check para
Advanced Security. Sao os icones corretos de cada servico, nao aproximacoes.

## Sem marca oficial disponivel
Microsoft Fabric, Purview, Microsoft 365 Copilot, Copilot Studio, Agent 365 e
Defender for Cloud nao tem marca em nenhuma fonte licenciada que eu tenha aqui.
No deck eles usam um glifo Octicon claramente generico na cor do fornecedor, com
o nome correto no title, em vez de um logo falso. Se voce tiver os assets oficiais
no portal de marca interno, e so trocar os simbolos gx- no sprite.

## Marcas (pasta brands/)
Marcas monocromaticas do simple-icons, cujos arquivos SVG sao CC0 1.0. A marca
registrada continua de cada empresa, e o uso aqui e nominativo: identificar o
produto de que o slide fala. O quadrado Microsoft foi desenhado, nao baixado.

Nao ha OpenAI nem AWS: as duas foram removidas do simple-icons a pedido das
empresas. Para AWS, num slide de compete, o texto e melhor que o logo.

## draw.io
claude-on-azure.drawio-library.xml e uma biblioteca custom com os 30 icones.
No draw.io: File, Open Library from, Device. Os icones ficam na barra lateral
e arrastam direto para o diagrama.

O draw.io ja traz uma biblioteca Azure nativa, derivada deste mesmo pacote da
Microsoft: More Shapes, Networking, Azure. Esta biblioteca aqui e so o recorte
que o deck usa, para nao ter que caçar entre 714.

## No deck
Os 41 simbolos estao embutidos como um sprite SVG inline no arquivo HTML, entao o
deck continua sendo um arquivo unico e funciona sem rede.
