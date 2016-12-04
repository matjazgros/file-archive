<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Response;

class UsersController extends Controller
{
  public function me(Request $request)
  {
    return ['user' => User::find($request->user()->id)];
  }

  public function login(Request $request)
  {
    $data = $request->json()->all();
    $user = User::where('email', $data['email'])->first();
    if ($user && password_verify($data['password'], $user->password)) {
      $usr = User::find($user->id);
      $token = $usr->createToken('accessToken')->accessToken;
      return ['user' => $user, 'token' => $token];
    }

    return Response::make('Wrong email and/or password', 422);
  }

  protected function create(Request $request)
  {
    $this->validate($request, [
      'email' => 'required|email|unique:users,email',
      'password' => 'required|size:6',
      'password1' => 'required|same:password',
    ],[
      'password1.required' => 'The confirm password field is required.',
      'password1.same' => 'Passwords must match.',
    ]);

    $data = $request->json()->all();

    return User::create([
      'email' => $data['email'],
      'name' => $data['email'],
      'password' => bcrypt($data['password']),
    ]);
  }
}
