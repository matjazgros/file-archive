<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::get('users/me', 'UsersController@me')->middleware('cors', 'auth:api');
Route::post('users/login', 'UsersController@login')->middleware('cors');
Route::post('users/logout', 'UsersController@logout')->middleware('cors', 'auth:api');
Route::post('users', 'UsersController@create')->middleware('cors'); //register

Route::post('files', 'FilesController@create')->middleware('cors', 'auth:api');
Route::delete('files/{id}', 'FilesController@delete')->middleware('cors', 'auth:api');
Route::get('files', 'FilesController@get')->middleware('cors', 'auth:api');
Route::get('files/{id}', 'FilesController@download')->middleware('cors'); //auth not needed
Route::get('files/{id}/thumb', 'FilesController@thumb')->middleware('cors');
