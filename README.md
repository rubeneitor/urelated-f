
#

#### Table of Contents  

- [How to run 🚀](#How-to-run-)  
- [DB 💾](#DB-) 
- [Backend 🔙](#Backend-) 
	- [User endpoints](#USER)
	- [Product endpoints](#MOVIE)

- [Frontend 👁‍🗨](#Frontend-)  

#



<br>

# ¿Qué es? 👀

Es un portal de empleo creado y diseñador por [Rubén](https://github.com/rubeneitor) y [David](https://github.com/Dave86dev/) que usa:

- Frontend: 🌌 React 16 + Redux
- Backend: 🔸 PHP Laravel 
- DB: 🍃 MySQL 

Durante el desarrollo hemos usado [este tablón de Trello](https://trello.com/b/OY1doF76/urelated).


<br>

# Cómo lanzarlo 🚀

- Descargar [Repositorio Backend](https://github.com/Dave86dev/urelated-b).
- Descargar [Repositorio Frontend](https://github.com/rubeneitor/urelated-f)
- En el the backend ejecutar:
	- `php artisan serve`
- En el the frontend ejecutar:
	- `npm start`
- Debería abrirse en http://localhost:3000/


<br>

# DB 💾

Esquema DB
![](https://trello-attachments.s3.amazonaws.com/5e1f91537a519b60467910d8/1183x825/5e51f9d802a14358f11d9476697db190/b069e56af23f426d8c03c1f91c63acde.png)


<br>

# Backend 🔙

## **Endpoints** 📃

## USER

- Register
	- **POST** /user/register
```json
{
	"username":  "Username",
	"email": "asd@asd.com",
	"password":  "1234",
	"phone": "647123456",
	"address": "c/ Falsa, 123",
	"billing": {
		"cardNumber": 123456789,
		"cardOwner": "Name Name Name",
		"cardExpireDate": [6, 22]
	}
}
```

- Login
	- **POST** /user/login
```json
{
	"username":  "Icaruk",
	"password":  "1234"
}
```

- Logout
	- **GET** user/logout?token={token}
	
- Get user data
	- **GET** user/{userId}?token={token}

- Delete user
	- **DELETE** user/delete/{userId}?token={token}

#
## PRODUCT

- Get products
	- GET /product/get?{params}
		- Posibles params:
		- NOTA: title, id y ownerId NO son combinables!
			
			* title (que contenga esas palabras)
				title=a	
				title=silla
				title=silla+negra
			
			* id
				id= <_id de mongo>
			
			* ownerId
				id= <_id de mongo>
			
			* isActive (default true)
				isActive=false
			
			* sort (default pa)
				sort=pa
				
				- pa: price ascendant
				- pd: price descendant
				- ra: rating ascendant
				- rd: rating descendant
				- tsa: times sold ascendant
				- tsd: times sold descendant
			
			* limit (default 500)
				limit=20
				
			* skip (default 0)
				skip=20
			
			* category
				category=electron
				
			* minPrice
				minPrice=100
			
			* maxPrice
				maxPrice= 500
				
		- Ejemplos:	
			- Top 10 productos más vendidos
			`/product/get?sort=tsd&isActive=true&limit=10`
			
			- Top 10 productos más baratos de electrónica
			`/product/get?sort=pa&isActive=true&limit=10&category=electron`

#
## RATING



<br>

# Frontend 👁‍🗨

## Features 📃

- Homepage:
	- Slider con los productos más comprados
	- Slider con los productos mejor valorados
	- Slider con los productos recomendados para tí
	- Slider con los productos más económicos
	![](https://i.gyazo.com/a456e720e93b848a44dc022d74b958d3.png)
	
- Búsqueda
	- Pulsando sobre la lupa se puede hacer una búsqueda vacía, mostrando todos los productos.
	- Filtros:
		- Precio mínimo y/o máximo
		- Categoría
	- Orden
		- Precio
		- Valoración
	![](https://i.gyazo.com/1602a91036f6d31bdae8346720ecc714.png)
	![](https://i.gyazo.com/e2de0a635bf0932c94798033f5aa52a4.png)

- Productos
	- Detalle
		- Con slider de productos relacionados
		- Hasta 4 imágenes para cada producto
		![](https://i.gyazo.com/7647a28283368875364ee96f4598e4e2.png)
	
- Usuarios
	- Login
	![](https://i.gyazo.com/37f94d1fc7cb9a88a1ebdd4d0149ff38.png)
	
	- Register
	![](https://i.gyazo.com/446850db3ba5442702765894d0098e7f.png)
	
	- Password reset
	![](https://i.gyazo.com/c7167e393ec9af23676e77a9022c559f.png)
	![](https://i.gyazo.com/e1f573578718a529d6309e27ede99f6f.png)
	
	- Perfil
	![](https://i.gyazo.com/f3084c34909a723e30508ad8b27faf68.png)
	
- Cesta
	- Header
	![](https://i.gyazo.com/fe2aa02770880de44ec2cdc942d8cef2.png)
	
	- Productos
	![](https://i.gyazo.com/665d95426cc1c2d1f58e67efd05ac2fb.png)
	
	- El precio total de la cesta se actualiza en vivo
	https://i.gyazo.com/e275345d4c129e89349917210727717a.mp4

- Mi inventario
	- Productos
	![](https://i.gyazo.com/a55c940bc027484e61141891be3d12d2.png)
	
	- Editar producto
	![](https://i.gyazo.com/523777829396378bf2e6d64ee9812860.png)

	- Añadir producto
		- Vista simultánea prototipica de anuncio.

	![](https://i.gyazo.com/a909c1294deb997a57167df6b57ccb5e.png)

- Admin
	- Purchases
		- Búsqueda simultánea por dia, mes y año.
		- Posibilidad de reiniciar filtros con un solo click.
		- Información precisa de compra.
		- Visualización dinámica de estado.
			
	![](https://i.gyazo.com/9c8710326111588ba67d7d34623588be.png)
	

<br>

# [🡅 TOP 🡅](#Table-of-Contents)  
