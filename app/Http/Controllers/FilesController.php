<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\File;
use FFMpeg;
use Webpatser\Uuid\Uuid;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Intervention\Image\Facades\Image;

class FilesController extends Controller
{
    public function create(Request $request)
    {
        $this->validate($request, [
          'file' => 'mimetypes:audio/mpeg,audio/mp3,image/jpg,image/jpeg,image/png,video/mp4',
        ], [
          'file.mimetypes' => 'Only jpg, png, mp3 and mp4 files are allowed.'
        ]);
        $varName = 'file';

        if ($request->file($varName)->isValid()) {

          $disk = Storage::disk(env('STORAGE', 'local'));

          $file = new File;
          $file->name    = $request->file->getClientOriginalName();
          $file->path    = $request->file($varName)->store('files', env('STORAGE', 'local'));
          $file->user_id = $request->user()->id;
          $file->hash    = null;
          $file->mime    = Input::file($varName)->getMimeType();
          $file->size    = $request->file->getSize();
          $file->save(); //save to get id

          $thumbPath = 'files/thumb_'.str_replace('files/', '', $file->path);

          $file->thumb = $thumbPath;
          $file->hash  = Uuid::generate(5, $file->id, Uuid::NS_DNS);
          $file->save();


          switch ($file->mime) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':

              $image = (string) Image::make(Input::file($varName))
                ->resize(150, 150)
                ->encode(str_replace('image/', '', $file->mime));

              $disk->put($file->thumb, $image);

              break;
            case 'video/mp4':
              // TODO: get paths from config
              $ffmpeg = FFMpeg\FFMpeg::create([
                'ffmpeg.binaries'  => env('FFMPEG', '/usr/bin/ffmpeg'),
                'ffprobe.binaries' => env('FFPROBE', '/usr/bin/ffprobe')
              ]);

              $video = $ffmpeg
                ->open(Input::file($varName)
                ->getPathName());

              if ($video) {

                $file->thumb = str_replace('.mp4', '.png', $file->thumb);

                $tempThumbPath = $disk
                  ->getDriver()
                  ->getAdapter()
                  ->getPathPrefix();

                $tempThumbPath .= '/' . $file->thumb;

                $video
                    ->frame(FFMpeg\Coordinate\TimeCode::fromSeconds(0))
                    ->save($tempThumbPath);

                $disk->put($file->thumb, file_get_contents($tempThumbPath));
                $file->save();
                unlink($tempThumbPath);

              }

              break;
            case 'audio/mp3':
            case 'audio/mpeg':

              $file->thumb = null;
              $file->save();

            default:
              break;
          }

          return ['file' => File::where('id', $file->id)->first()];
        }

        return ['err' => true];
    }

    public function get(Request $request)
    {
      return ['files' => File::where('user_id', $request->user()->id)->get()];
    }

    public function download(Request $request, $id)
    {
      $file = File::where('hash', $id)->first();

      if (!$file) {
        return Response::make('', 404);
      }
      $disk = Storage::disk(env('STORAGE', 'local'));
      return Response::make($disk->get($file->path), '200', [
        'Content-Type'        => 'application/octet-stream',
        'Content-Disposition' => 'attachment; filename="'.$file->name.'"'
      ]);
    }

    public function thumb(Request $request, $id)
    {
      $file = File::where('hash', $id)->first();

      if (!$file) {
        return Response::make('', 404);
      }
      if ($file->thumb) {
        $disk = Storage::disk(env('STORAGE', 'local'));
        $data = $disk->get($file->thumb);
      } else {
        // return empty/white image
        $canvas = Image::canvas(1, 1, '#fff');
        $data = (string) Image::make($canvas)->resize(1, 1)->encode('png');
      }

      return Response::make($data, '200', [
        'Content-Type' => 'application/octet-stream',
      ]);
    }

    public function delete(Request $request, $id)
    {
      $file = File::where('id', $id)->where('user_id', $request->user()->id)->first();

      if ($file) {
        $other = File::where('path', $file->path)->get();
        if ($other && sizeof($other) == 1) {
          $disk = Storage::disk(env('STORAGE', 'local'));
          $file->path && $disk->delete($file->path);
          $file->thumb && $disk->delete($file->thumb);
        }

        $file->delete();

        return Response::make(null, '204', [
          'Content-Type' => 'application/octet-stream',
        ]);
      }

      return Response::make('', 404);
    }
}
