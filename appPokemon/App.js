import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, ScrollView, FlatList} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Axios from 'axios';
import GeoLocation from '@react-native-community/geolocation'


export default function Upload() {
  const [avatar, setAvatar] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [county, setCounty] = useState();

  const [pokemonName, setPokemonName] = useState();

  const [abilities, setAbilities] = useState([]);
  const [type, setType] = useState([]);
  const [heigth, setHeigth] = useState();
  const [weigth, setWeigth] = useState();

  const imagePickerOptions = {
    title: 'Selecione uma imagem',
    customButtons: [

    ],
  };
  function getLocation() {

    GeoLocation.getCurrentPosition(

    async (pos) => {

      // setLatitude(pos.coords.longitude);
      // setLongitude(pos.coords.latitude);
      const oi = await Axios.get('https://nominatim.openstreetmap.org/reverse',{params:{lat:pos.coords.latitude, lon:pos.coords.longitude, format:'json'}})
      const {city,county,state} = oi.data.address
      setCity(city);
      setCounty(county);
      setState(state);
      },
      (error) => Alert.alert("Erro", error.message),
      {

        enableHighAccuracy: false, timeout: 120000, maximumAge: 1000

      }
    );

  }

  function imagePickerCallback(data) {
    if (data.didCancel) {
      return;
    }

    if (data.error) {
      return;
    }

    if (data.customButton) {
      return;
    }

    if (!data.uri) {
      return;
    }

    setAvatar(data);
  }

  async function uploadImage() {
    const data = new FormData();
    data.append('image', {
      uri: avatar.uri,
      type: 'image/png',
      name: 'profile-picture'
    });
    try {
      const response = await Axios.post("http://192.168.1.105:4003/im_size", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPokemonName(response.data.pokemon);
     
      console.log(response.data.pokemon)
      getPokemonData(response.data.pokemon.toLowerCase())
    } catch (err) {
      console.log(err)
    }
  }

  async function getPokemonData(nome){
    const response = await Axios.get("https://pokeapi.co/api/v2/pokemon/"+ nome)
    const {name, abilities, types, height, weight} = response.data
   
    setAbilities(abilities);
    setType(types);
    setHeigth(height);
    setWeigth(weight);
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.Text}>PoKeMania</Text>
      <TouchableOpacity
        onPress={getLocation}
        style={styles.button2}>
        <Text style={styles.buttonText}>Onde está seu Pokemon?</Text>
      </TouchableOpacity>
      <Text style={styles.textLocation}>Seu pokemon se encontra em:</Text>
      <Text style={styles.textLocation1}>{county}, {city} - {state} </Text>
      <Image
        source={{
          uri: avatar
            ? avatar.uri
            : 'https://mltmpgeox6sf.i.optimole.com/w:761/h:720/q:auto/https://redbanksmilesnj.com/wp-content/uploads/2015/11/man-avatar-placeholder.png',
        }}
        style={styles.avatar}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          ImagePicker.showImagePicker(imagePickerOptions, imagePickerCallback)
        }>
        <Text style={styles.buttonText}>Escolha seu pokemon</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={uploadImage}>
        <Text style={styles.buttonText}>Que Pokemon é esse?</Text>
      </TouchableOpacity>
      <Text style={styles.TextPok}> Este pokemon é: {pokemonName}</Text>
      <Text style={styles.TextPok}> Sua altura é: {heigth} ''</Text>
      <Text style={styles.TextPok}> Seu peso é: {weigth} lb</Text>
      <Text style={styles.TextPok}> Suas habilidades são:</Text>
      <FlatList data={abilities} renderItem={({item})=><Text style={styles.TextPok}> • {item.ability.name}</Text>} />
      <Text style={styles.TextPok}> Seus tipos são: </Text>
      <FlatList data={type} renderItem={({item})=><Text style={styles.TextPok}> • {item.type.name}</Text>} />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
 TextPok: {
    color: '#FFF',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FE220A',
    marginTop:20,

  },
  textLocation: {
    color: '#FFF',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FE220A',
    marginBottom: 10,
    marginTop: -20,

  },
  textLocation1: {
    color: '#FFF',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FE220A',
    marginBottom: 10,


  },
  Text: {
    color: '#E6FA2E',
    fontSize: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FE220A',
    marginBottom: 10,

  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FE220A',
  },
  button: {
    width: 350,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#FE7A0A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,

  },
  button1: {
    width: 350,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#FE7A0A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  button2: {
    width: 350,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#FE7A0A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 50,
  },
});
